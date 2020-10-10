const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = mongoose.Schema({
    description: {
                type: String,
                required:true,
                trim:true,
                validate(value){
                    if(validator.isEmpty(value)){
                     throw new Error('Description cannot be empty')
                    }
                }
            },
            completed: {
                type: Boolean,
                default:false
            },
            owner:{
                type: mongoose.Schema.Types.ObjectId,
                required:true,
                //ref = reference to another model
                ref:'User'
                
            }
},{
    timestamps:true
})

// const Task = new mongoose.model('Task', {
//     description: {
//         type: String,
//         required:true,
//         trim:true,
//         validate(value){
//             if(validator.isEmpty(value)){
//              throw new Error('Description cannot be empty')
//             }
//         }
//     },
//     completed: {
//         type: Boolean,
//         default:false
//     },
//     owner:{
//         type: mongoose.Schema.Types.ObjectId,
//         required:true,
//         //ref = reference to another model
//         ref:'User'
        
//     }
// })
const Task = mongoose.model('Task',taskSchema)
module.exports=Task

// const goShopping = new Task({
//     description:'go to supermarket',
   
// })

// goShopping.save().then(()=>{
//     console.log("Saved")
// }).catch((error)=>{
//     console.log('Not saved ', error)
// })

/*SETTING A RELATIONSHIP BETWEEN A USER AND A TASK
either the user will hold on ids of all the tasks he created or
the task will store the id of the user */