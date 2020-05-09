const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/accounts')

const router = new express.Router()

// creating user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

// login 
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user) {
            res.status(404).send()
        }
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(404).send()
    }
})

// Reading profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// logout from current session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return  token.token !== req.token
        })

        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send
    }
})

// logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send
    }
})

// Reading user with id using route parameters
/* router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.send(500).send()
    }
}) */

// Updating user with id
/* router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']

    // to check if all the updates requested is in allowed updates (also if there is any non-existing db property update)
    const isVaidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isVaidUpdate) {
        res.status(404).send({ error: 'invalid updates'})
    }

    try {

        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])
        
        await user.save()
        console.log(user)
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
}) */

// update current user data
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isVaidUpdate = updates.filter((update) => allowedUpdates.includes(update) )

    if(!isVaidUpdate) {
        res.status(404).send({ error: 'invalid update action'})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e) {
        res.status(500).send(e)
    }
})

// delete user with id
/* router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
}) */

// delete current user data
router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

const upload = multer({ 
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpe?g|png)$/)) {
            return cb(new Error('Only jpg, jpeg, png file types allowed.'))
        }
        cb(undefined, true)
    }
})

// upload profile pic
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// delete profile pic
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Reading profile pic
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if( !user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch(e){
        res.status(404).send()
    }
})

module.exports = router