const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/users')
// const { response } = require('express')
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT 
//you have deleted || number of local port because of environment variables (PORT is the name of your variable too)

//for middleware to be registered we use app.use(). Instead of passing a variable (which you have created with express)
//you pass a function:

// app.use((req, res, next)=>{
// if(req.method === "GET"){
//     res.send('GET requests are disabled')
// }else{
//     next()
// }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('This site is in maintance mode')
// })

//for json to be parsed
app.use(express.json())
app.use(userRouter,taskRouter)


//CRUD - POST FOR CREATE (PATH AND CALLBACK FUNCTION)
// app.post('/users', (req, res) => {
//     const user = new User(req.body)
//     user.save().then(() => {
//         res.status(201).send(user)
//     }).catch((e) => {
//         res.status(400).send(e)

//     })
// })
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
//HASHING PASSWORDS WITH BCRYPT
// const bcrypt = require('bcryptjs')

// const passFunction = async ()=>{
//     const password = 'Red12345!'
//      //bcrypt.hash() takes two arguments: 1. the text, how many times the algorithm is executed - returns a promise
//     const hashedPass = await bcrypt.hash(password, 8)
   
//     console.log(password)
//     console.log(hashedPass)

//     //matching password (with ones stored in database) 
//     //bcrypt.compare() - returns a promise - 2 arguments: plain pass - hashed pass
//     const isMatch = await bcrypt.compare('Red1235!',hashedPass)
//     console.log(isMatch)
// }
// passFunction()

//AUTHENTICATION TOKENS:

// const jwt = require('jsonwebtoken')

/*toJSON method (when you use res.send() json.stingify is called behind the scenes*/
// const pet = {
//     name:'Cookie'
// }
// /*i can manipulate what comes back*/
// pet.toJSON = function()
// {
//    return{}
// }
// console.log(JSON.stringify(pet))
/*LINK TASK WITH USER
STEP ONE - FIND THE USER OF THE TASK*/

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const task = await Task.findById('5f6e51eacc2dbb56bc9bede3')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)
// }

/*STEP TWO: FIND THE TASKS OF A USER*/

// const main = async ()=>{
//     const user = await User.findById('5f6e4f668915de187064fb93')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()
//FILE UPLOAD
/*Install multer and then configure it (multiple times in the app)*/
// const multer = require('multer')

// const upload = multer({
//     dest:'images',  //where files are going to be saved
//     limits:{
//         fileSize:1000000 //is in bytes, so 2 milion is 2MB
//     },                  //cb=callback (use it for errors)
//     fileFilter(req, file, cb){
//         // if(!file.originalname.endsWith('.pdf')){
//         //     return cb(new Error('Please upload a PDF file'))
//         // }
//         if(!file.originalname.match(/\.(doc|docx)$/)){//regular expression
//             return cb(new Error('Please upload a doc file'))
//         } 
//         cb(undefined,true)
        
        //ways to call a callback
    //    cb(new Error('Files must be PDF'))
    //    cb(undefined,true)
    //    cb(undefined,false) (silently rejected)
//     }
// })



// app.post('/upload', upload.single('upload'), (req,res) =>{
//     res.send()
// },(error, req, res, next)=>{
//     res.status(400).send({error:error.message})//this function must have this signature or it doesn't work
// })






