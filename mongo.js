//CRUD
//CREATE
// const mongoDB = require('mongodb')
// const MongoClient = mongoDB.MongoClient
// //to autogenerate IDs
// const ObjectID = mongoDB.ObjectID

//destructuring...

const { MongoClient, ObjectID, Db } = require('mongodb')

const uri = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


// // const id = new ObjectID()
// // console.log(id)
// // console.log(id.getTimestamp())

// MongoClient.connect(uri, { useUnifiedTopology: true }, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database')
//     }

//     const db = client.db(databaseName)

//     //one user
//     db.collection('Users').insertOne({

//         name: 'Maria',
//         age: 22
//         //second argument a callback function if things go wrong
//     }, (error, result) => {
//         if (error) {
//             return console.log('Unable to insert the user')
//         }
//         //result has one argument OPS (the documents inserted)
//         console.log(result.ops)
//     })

//     //many users

//     db.collection('Users').insertMany([
//         {
//             name: 'Jen',
//             age: 29
//         },
//         {
//             name: 'John',
//             age: 36
//         }
//     ],(error, result)=>{
//         if(error){
//             return console.log('Unable to insert documents')
//         }
//         console.log(result.ops)
//     })

//     db.collection('Tasks').insertMany([
//         {
//             description: 'Install node.js and npm',
//             completed: true
//         },
//         {
//             description: 'Install robo3t',
//             completed: true
//         },
//         {
//             description: 'Connect to database',
//             completed: false

//         }
//     ], (error, result) => {
//         if (error) {
//             return console.log('Unable to insert documents in database')
//         }
//         console.log(result.ops)
//     })
// })


//READ find() and findOne()

// const { MongoClient, ObjectID } = require('mongodb')

// const uri = 'mongodb://127.0.0.1:27017'
// const databaseName = 'task-manager'

// MongoClient.connect(uri, { useUnifiedTopology: true }, (error, client) => {
//         if (error) {
//             return console.log('Unable to connect to database')
//         }

//         const db = client.db(databaseName)
//         //find excepts an object (criteria) and a callback - is called when the operation is complete
//          db.collection('Users').findOne({name:'Liana'},(error, user)=>{
//            if(error || user===null){
//                return console.log('Unable to find user')
//            }
//            console.log(user)
//          })
// //find does not have a callback function as an argument. it takes a cursor
//          db.collection('Users').find({age:43}).toArray((error,users)=>{
//             console.log(users)

//          })


//     })

//UPDATE
//updateOne (filter, update, callback or promise)

// MongoClient.connect(uri, { useUnifiedTopology: true }, (error, client) => {
//   if (error) {
//     return console.log('Update has failed')
//   }
//   const db = client.db(databaseName)
//   const updatePromise = db.collection('Users').updateOne({ //first argument=filter (which document)
//     _id: new ObjectID('5f46424d0b6a3205e482bbcf')
//   }, { //the update (with update operators - check documentation)
//     $set: {
//       name: 'Mike'
//     }

//   })  //if you were using callbacks, you would have to provide the third parameter (callback - error or result) 
//   //with promises you do not have to do that. 
//   updatePromise.then((result) => {
//     console.log(result)

//   }).catch((error) => {
//     console.log(error)
//   })
// })
//UPDATE MANY
// MongoClient.connect(uri,{ useUnifiedTopology: true },(error,client)=>{
// if (error){
//   return console.log(error)
// }
// const db = client.db(databaseName)
// db.collection('Tasks').updateMany({
//   completed:false
// },{
//   $set:{
//     completed:true
//   }
// }).then((result)=>{
//   console.log('Update has been fulfilled')
// }).catch((error)=>{
//   console.log(error)
// })
// })

//DELETE deleteMany,deleteOne

// MongoClient.connect(uri, { useUnifiedTopology: true }, (error, client) => {
//   if (error) {
//     return console.log(error)
//   }
//   const db = client.db(databaseName)
  // db.collection('Users').deleteMany({
  //   age:43
  // }).then((result)=>{
  //   console.log('Users are deleted')
  // }).catch((error)=>{
  //   console.log(error)
  // })

//   db.collection('Tasks').deleteOne({
//     _id: new ObjectID('5f464d0a18f5991d04797300')
//   }).then((result) => {
//     console.log('Task has been deleted')
//   }).catch((error) => {
//     console.log('Something went wrong')
//   })
// })

