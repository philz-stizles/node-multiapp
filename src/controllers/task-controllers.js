// const { validationResult } = require('express-validator')
const Task = require('./../models/Task')

exports.createTask = (req, res) => {
    const newTask = new Task({ ...req.body, creator: req.user._id })
    newTask.save()
        .then((result) => {
            res.status(201).send({ status: true, data: result, message: 'Created Successfully' })
        })
        .catch(error => {
            console.log(error)
            return res.status(400).send({ status: false, data: error, message: error.message })
        })
}

exports.getTask = (req, res) => {
    const _id = req.params.id
    Task.findOne({ _id, creator: req.user._id}).populate('creator', ['username'])
        .then((task) => {
            if(!task) {
                return res.status(404).send({ status: false, message: 'Task was not found' })
            }
            res.status(200).send({ status: true, data: task, message: 'Retrieved Successfully' })
        })
        .catch(error => {
            console.log(error)
            return res.status(400).send({ status: false, data: error, message: error.message })
        })
}

// GET /tasks?sortBy=createdAt:desc
exports.getAllTasks = (req, res) => {
    // req.query
    const { page, entitiesPerPage, completed, sortBy } = req.query

    const skip = (!page) ? 0 : (page - 1) * entitiesPerPage
    const limit = (!entitiesPerPage) ? 0 : entitiesPerPage

    const match = {}
    if(completed) {
        match.completed = (completed === 'true') ? true : false
    }

    const sort = {}
    if(sortBy) {
        const [field, direction] = sortBy.split(':')
        sort[field] = (direction === 'desc') ? -1 : 1
    }

    // METHOD 1
    // Task.find({ creator: req.user._id })
    //     .populate('creator', ['username'])
    //     .sort({})
    //     .skip(entitiesPerPage)
    //     .then((tasks) => {
    //         res.status(200).send({ status: true, data: tasks, message: 'Retrieved' })
    //     })
    //     .catch(error => {
    //         console.log(error)
    //         return res.status(400).send({ status: false, data: error, message: error.message })
    //     })

    // METHOD 2
    req.user.populate({
        path: 'tasks',
        match,
        options: { skip, limit, sort }
    }).execPopulate()
        .then((user) => {
            res.status(200).send({ status: true, data: {
                tasks: user.tasks,
                count: user.tasks.length
            }, message: 'Retrieved' })
        })
        .catch(error => {
            console.log(error)
            return res.status(500).send({ status: false, data: error, message: error.message })
        })
}

exports.updateTask = (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'completed']
    // const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    const inValidFields = updates.filter(update => !allowedUpdates.includes(update))

    if(inValidFields.length > 0) {
        const data = `${inValidFields.join(', ')} ${(inValidFields.length > 0) ? 'are invalid fields': 'is an invalid field'}`
        return res.status(400).send({ status: false, data, message: 'Update failed' })
    }

    Task.findOne({ _id, creator: req.user._id })
        .then((task) => {
            if(!task) {
                return res.status(404).send({ status: false, data: _id, message: 'Task was not found' })
            }

            updates.forEach(update => task[update] = req.body[update])
            return task.save()
        })
        .then(task => res.status(200).send({ status: true, data: task, message: 'Updated successfully' }))
        .catch(error => {
            console.log(error)
            return res.status(400).send({ status: false, data: error, message: error.message })
        })
}

exports.deleteTask = (req, res) => {
    const _id = req.params.id
    const creator = req.user._id 
    Task.findOneAndDelete({ _id, creator }) // Example with Promise-chaining
        .then((task) => {
            console.log(task)
            if(!task) {
                return false
            } else {
                return Task.countDocuments({ completed: false, creator })
            }
        })
        .then((count) => {
            if(!count) {
                return res.status(404).send({ status: false, data: id, message: 'Task was not found' })
            }
            return res.status(200).send({ status: true, data: { inCompleteTasks: count }, message: 'Deleted successfully' })
        })
        .catch(error => {
            console.log(error)
            return res.status(400).send({ status: false, data: error, message: error.message })
        })
}

exports.uploadFile = (req, res) => {
    try {
        // console.log(req)
        return res.status(201).send({ status: true, message: 'Uploaded Successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: false, data: error.message })
    }
}


