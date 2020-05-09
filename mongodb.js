// CRUD Create, Read, Update and Delete

const {MongoClient, ObjectID} = require('mongodb')
//const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology:true, useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)
    
    /* db.collection('users').insertOne({
        name: 'Amar',
        age: 25
    }) */

    /* db.collection('users').insertMany([
        {
            name: 'Thanos',
            age: 50
        }, {
            name: 'Captan America',
            age: 28 
        }
    ], (error, result) => {
        if(error) {
            return console.log('Unable to add documents!')
        }
        console.log(result.ops)
    }) */

    /* db.collection('tasks').insertMany([
        {
            description: 'Clean the house',
            completed: true
        }, {
            description: 'Renew inspection',
            completed: false
        }, {
            description: 'Pot plants',
            completed: false
        }
    ], (error, result) => {
        if(error) {
            return console.log('Unable to add tasks!')
        }
        console.log(result.ops)
    }) */

    /* db.collection('users').findOne({age: 28}, (error, user) => {
        if(error) {
            return console.log("Unable to find!")
        }
        console.log(user)
    }) */

    /* db.collection('users').find({age: 25}).toArray((error, users) => {
        if(error) {
            return console.log("Unable to find!")
        }
        console.log(users)
    }) */

    /* db.collection('users').find({age: 25}).count((error, count) => {
        if(error) {
            return console.log("Unable to find!")
        }
        console.log(count)
    }) */

    /* db.collection('tasks').findOne({_id: new ObjectID('5e8d671fdf4ecd38c81fe020')}, (error, task) => {
        if(error) {
            return console.log("Unable to find!")
        }
        console.log(task)
    })

    db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
        if(error) {
            return console.log("Unable to find!")
        }
        console.log(tasks)
    }) */

    /* db.collection('tasks').updateMany({
        completed: false
    },{
        $set:{
            completed: true
        }
    }).then((result) => {
        console.log(result.)
    }).catch((error) => {
        console.log('Unable to upload!')
    })  */

    db.collection('tasks').deleteOne({
        _id: new ObjectID('5e8d671fdf4ecd38c81fe01f')
    }).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log('Unable to delete!')
    })
} )