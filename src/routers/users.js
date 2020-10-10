const express = require('express')
//for uploading files
const multer = require('multer')
//resize the image
const sharp = require('sharp')
const router = new express.Router()

const User = require('../models/user')
const auth = require('../middleware/auth')
// const avatar = multer({
//     dest: 'avatars'
// })

//destructuring
const {sendWelcomeMail, cancellationEmail} = require('../emails/account')
const { send } = require('@sendgrid/mail')


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

})

//find users by their credidentials:

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //generate an authentication token for a specific user not User 
        const token = await user.generateAuthToken()
        // res.send(user)
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})




//CRUD - READ
// app.get('/users', (req, res) => {
//     User.find({}).then((user) => {
//         res.send(user)
//     }).catch((e) => {
//         res.status(500).send()
//     })
// })

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(e)

    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()

    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()

    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


//by id - express route parameters (parts of the url that are used to capture dynamic values)
// app.get('/users/:id', (req, res) => {
//     const __id = req.params.id
//     User.findById(__id).then((user) => {
//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)

//     }).catch((e) => {
//         res.status(404).send(e)
//     })
// })

router.get('/users/:id', async (req, res) => {
    const __id = req.params.id
    try {
        const user = await User.findById(__id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)

    } catch (e) {
        res.status(404).send(e)
    }
})

// router.patch('/users/:id', async (req, res) => {

//     const updates = Object.keys(req.body)
//     const allowUpdated = ['name', 'email', 'password', 'age']
//     const isValid = updates.every((update) => {
//         return allowUpdated.includes(update)
//     })

//     if (!isValid) {
//         return res.status(400).send('Error: Invalid updates!')

//     }
//     try {
//find byid bypass mongoose.It performs direct operation to database
// const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, runValidators: true
// })
//in order for middleware to work (hashed password)

//         const user = await User.findById(req.params.id)
//         updates.forEach((update)=>{
//             user[update]=req.body[update]
//         })
//         await user.save()

//         if (!user) {
//             res.status(404).send()
//         }
//         res.send(user)

//     } catch (e) {
//         res.status(400).send(e)
//     }
// })
/*UPDATE YOUR PROFILE*/
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowUpdated = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => {
        return allowUpdated.includes(update)
    })

    if (!isValid) {
        return res.status(400).send('Error: Invalid updates!')
    }

    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)

    }
})

// router.delete('/users/:id', async (req,res)=>{
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send('User is not found')
//         }
//         res.send(user +' User  has been deleted')
//     }catch(e){
//         res.status(500).send(e)

//     }
// })

/*for user to delete his profile*/
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        cancellationEmail(req.user.email, req.user.name)
        res.send('Your profile has been deleted')

    } catch (e) {
        res.status(500).send(e)

    }
})

const upload = multer({
    // dest:'avatars', you cannot save avatar in editor (avatas file) because when you deploy the app in other server images will be deleted
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
            return cb(new Error('You can only upload jpg, jpeg and png'))
        }
        cb(undefined, true)

    }
})

//key//
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send('You have uploaded a file')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('you have deleted your avatar image')
})

//fetching the avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        //response header with set (key-value pair)
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router