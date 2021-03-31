// const { validationResult } = require('express-validator')
const User = require('./../models/User')
const sharp = require('sharp')

exports.createUser = async (req, res) => {
    const { username, email, password, status } = req.body

    const newUser = new User({ username, email, password, status })
    try {
        const user = await newUser.save()
        return res.status(201).send({ status: true, data: user, message: 'Created' })
    } catch (error) {
        // console.log(error)
        return res.status(400).send({ status: false, data: error, message: 'Failed' })
    }
}

exports.getMe = async (req, res) => {
    try {
        res.send({ status: true, data: req.user, message: 'User retrieved Successfully' })
    } catch (error) {
        return res.status(500).send({ status: false, data: error, message: error.message })
    }
}

exports.getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        
        if(!user) {
            return res.status(404).send({ status: false, data: id, message: 'User was not found' })
        }
        
        res.send({ status: true, data: user, message: 'User retrieved Successfully' })
        
    } catch (error) {
        return res.status(500).send({ status: false, data: error, message: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.send({ status: true, data: users, message: 'Retrieved' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, data: error, message: error.message })
    }
}

exports.updateMe = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'status', 'age']
    const inValidFields = updates.filter(update => !allowedUpdates.includes(update))

    if(inValidFields.length > 0) {
        const data = `${inValidFields.join(', ')} ${(inValidFields.length > 0) ? 'are invalid fields': 'is an invalid field'}`
        return res.status(400).send({ status: false, data, message: 'Update failed' })
    }

    try {
        // METHOD 1
        // 1.) If you try to update with a field that is not in the schema, mongoose will completely ignore it. However,
        // It would be nice to return an error when this happens 
        //      const updates = Object.keys(req.body)
        //      const allowedUpdates = ['username', 'email', 'status', 'age']
        //      const isValidOperation = updates.every(update => allowedUpdates.includes(update))
        //      if(!isValidOperation) {
        //          return res.status(400).send({ status: false, message: 'Update failed, invalid fields' })
        //      }
        // const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { 
        //     new: true,
        //     runValidators: true // Ensure that all validators run when patching the resource
        // })
        // 
        // if(!updatedUser) {
        //     return res.status(404).send({ status: false, data: req.user, message: 'User was not found' })
        // }

        // res.status(200).send({ status: true, data: updatedUser, message: 'Updated Successfully' })

        // METHOD 2
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send({ status: true, data: req.user, message: 'Updated Successfully' })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, data: error, message: error.message })
    }
}

exports.deleteMe = async (req, res) => {
    try {
        // METHOD 1
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) {
        //     return res.status(404).send({ status: false, data: req.user, message: 'User was not found' })
        // }

        // METHOD 2
        // Note that a middleware has been created for the remove method to delete all attached Tasks when a user is removed
        await req.user.remove() 

        res.send({ status: true, data: req.user, message: 'Deleted' })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, data: error, message: error.message })
    }
}

exports.uploadAvatar = async (req, res) => {
    try {
        console.log(req.file) // req.file for upload.single() & req.files for upload.array()
        const transformedBuffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer()

        req.user.avatar = transformedBuffer // render avatar from the UI using
        // <img src="data:image/jpg;base64," alt="" />
        // req.user.avatar = `data:image/jpg;base64,${req.user.avatar}`
        await req.user.save()

        res.status(201).send({ status: true, message: 'Uploaded Successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

exports.getAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error('You have not uploaded any avatar yet')
        }

        res.set('Content-Type', 'image/png') // We are sending back an image, and not json,
        // so we need to specify the type and then use send() and not json(), since we are not sending json
        res.send(user.avatar)
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

exports.deleteAvatar = async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()

        res.status(201).send({ status: true, message: 'avatar deleted Successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}