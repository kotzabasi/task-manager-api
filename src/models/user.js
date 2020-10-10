const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
//for using hash passwords
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,  //field is required
        trim: true,
        lowercase: true

    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Mail is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // minlength:7
        validate(value) {
            if (value.length < 7 || value.toLowerCase().includes('password')) {
                throw new Error('Password must contain at least 6 characters and must not include the word password')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be greater than 0')
            }
        }

    },
    //to save authentication tokens per user in order to login from any devise and log out
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true
})

/*VIRTUAL PROPERTY (relationship between entities - does not exist in database)*/
//first parameter the name of the virtual collection, second an object
userSchema.virtual('tasks',{
    ref:'Task',
    //where local data is stored (user's id)
    localField:'_id',
    //the field in User (relationship)
        foreignField: 'owner'
})

// const tokenFunction = async ()=>{
//     //to create a new json token sign() with two arguments(an object (data empedded in token) and a string(a secret, to sign the token, random characters)) 
//     //- the return value is the token
//     //in order for the token to be expired, you provide a third argument (object) with options
//     const token = jwt.sign({__id: '123456'}, 'Thisisatoken', {expiresIn:'7 days'})
//     console.log(token)

//     //verify the token verify (2 arguments = token and secret)
//     const data = jwt.verify(token,'Thisisatoken')
//     console.log(data)
// }
// tokenFunction()

//methods are accessible by instances    //not arrow function because of this
userSchema.methods.toJSON = function(){
    //using function because of this keyword
   const user = this
   //mongoose method about raw objects
   const userObject = user.toObject()
   //you can manipulate userobject (what to be displayed)
   delete userObject.password
   delete userObject.tokens
  delete userObject.avatar

   return userObject

}

userSchema.methods.generateAuthToken = async function (){
const user = this
const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse')
//to save the token to the database
user.tokens = user.tokens.concat({token})
//call save
await user.save()
return token

}

/*Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.
accessible by model (java static methods)*/

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Wrong Password')
    }
    return user
}
// hash password before you save the user -middleware mongoose
//pre() = 2 arguments- event - a standard function (not arrow because of this binding )

userSchema.pre('save', async function (next) {
    const user = this //the user which is about to be saved
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()//for not hanging here for ever... move on - the user is saved
})

//delete user's tasks when user is removed

userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
   
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

//to save it to the database use methods like save(). Save method doesn't get arguments and returns a promise


// const stefanos = new User({
//     name:'Stefanos',
//     email:'stef@gmail.gr',
//     password:'3336667',
//     age:39
// })

// stefanos.save().then(()=>{
//     console.log('Data Saved')
// }).catch((error)=>{
//     console.log('There was an error ',error)
// })

// User.deleteOne({name:null}).then(()=>{
//     console.log('Deleted')
// }).catch((error)=>{
//     console.log('Deletion failed')
// })