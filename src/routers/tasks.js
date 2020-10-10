const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const { populate } = require('../models/task')

const Task = require('../models/task')

// app.post('/tasks', (req, res) => {
//     const task = new Task(req.body)

//     task.save().then(() => {
//         res.status(201).send(task)
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })
/*CREATE A TASK*/
// router.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)
//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })
/*CREAT A TASK BY OWNER*/
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        //spead operator
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)

    }
})

// app.get('/tasks', (req, res) => {
//     Task.find({}).then((task) => {
//         res.send(task)
//     }).catch((e) => {
//         res.status(500).send()
//     })
// })/*GET ALL TASKS*/
// router.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.status(200).send(tasks)
//     } catch (e) {
//         res.status(500).send(e)

//     }
// })

/*GET USER'S TASKS? completed =true or false (optionaly)*/
/*pagination:limit, and skip - GET/tasks?limit=10&skip=20
GET/tasks?short (or shortyBy) first argumet the field shorty by and second is the order
createdAt_asc or desc*/
router.get('/tasks', auth, async (req, res) => {
    const match ={}
    const sort ={}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        //ternary operatos
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
        try {
            // const tasks = await Task.find({owner: req.user._id}) IT WORKS with res.send(tasks)!
            await req.user.populate({
                path:"tasks",
                match,
                options:{
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                    
                }}).execPopulate()
            res.status(200).send(req.user.tasks)
        } catch (e) {
            res.status(500).send(e)
    
        }
    })



// app.get('/tasks/:id', (req, res) => {
//     const __id = req.params.id
//     Task.findById(__id).then((task) => {
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     }).catch((e) => {
//         res.status(404).send(e)
//     })
// })

// router.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const task = await Task.findById(_id)
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)

//     } catch (e) {
//         res.status(404).send(e)
//     }
// })

/*GET TASK BY ID (AUTHENTICATED)*/

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('There is no such task')
        }
        res.send(task)

    } catch (e) {
        res.status(404).send(e)
    }
})

//UPDATE TASK

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowUpdated = ['description', 'completed']
    const isValid = updates.every((update) => {
        return allowUpdated.includes(update)
    })

    if (!isValid) {
        return res.status(400).send('Error: Invalid updates!')

    }
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, runValidators: true
        // })
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id:req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        
        updates.forEach((update) => {task[update] = req.body[update]})
        await task.save()

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

//DELETE TASK
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id:req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Task is not found')
        }

        res.send(task + ' Task  has been deleted')

    } catch (e) {
        res.status(500).send(e)

    }
})

module.exports = router