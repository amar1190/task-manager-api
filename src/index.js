const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express()
const port = process.env.PORT

// using Express middleware
/* app.use((req, res, next) => {
    if(req.method === 'GET') {
        res.send('GET methods are disabled')
    } else {
        next()
    }
})

app.use((req, res, next) => {
    res.status(503).send('Server is under maintenance. Please try again soon.')
}) */

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => { 
    console.log('Server listening on port:',port)
})