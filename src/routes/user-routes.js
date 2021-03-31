const express = require('express');
const path = require('path');
const multer = require('multer');
const { authenticate, authorize } = require('../middlewares/auth-middleware');
const { createUser, getUser, getAllUsers, getMe, updateMe, deleteMe, uploadAvatar, getAvatar, deleteAvatar } = require('../controllers/user-controllers');
const { fileValidationMiddleware } = require('../middlewares/validation-middleware');

const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(authenticate, createUser)

router.route('/me')
    .get(authenticate, getMe)
    .patch(authenticate, updateMe)
    .delete(authenticate, deleteMe)

router.route('/:id').get(authenticate, getUser)

router.route('/:id/avatar').get(getAvatar)

const upload = multer({ 
    limits:  {
        fileSize: 1000000, // bytes, 1000000bytes = 1MB
        fields: 0,
        files: 1,
    },
    fileFilter(req, file, cb) {
        console.log('fileFilter', file)
        console.log('req', req.file)
        // if (file.mimetype == 'file/txt' || file.mimetype == 'file/pdf') {
        if (file.originalname.match(/\.jpg|jpeg|png$/gm))
        {
            cb(null, true);
        } else {
            cb(new Error('Upload must be either jpg, jpeg or png'));
            // cb(undefined, true);
        }
    }
})

router.route('/me/avatar') // Use this route for both upload and update avatar
    .post(authenticate, upload.single('avatar'), uploadAvatar, (error, req, res, next) => { // Create an additional inline 
        // error handling middleware(or optionally global) to handle throws from multer. The uploadAvatar middleware will 
        // only run if the multer upload passed validation. 
        res.status(400).send({ status: false, message: error.message })
    })
    .delete(authenticate, upload.single('avatar'), deleteAvatar)

module.exports = router;