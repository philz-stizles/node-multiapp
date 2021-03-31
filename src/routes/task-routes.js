const express = require('express');
const path = require('path');
const multer = require('multer');
const { createTask, getTask, getAllTasks,  updateTask, deleteTask, uploadFile } = require('../controllers/task-controllers');
const { authenticate } = require('./../middlewares/auth-middleware');

const router = express.Router();

router.use(authenticate);

router.route('/')
    .get(getAllTasks)
    .post(createTask);

router.route('/:id')
    .get(getTask)
    .patch(updateTask)
    .delete(deleteTask);

// // Configure file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '..', 'uploads', 'docs'));
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage, fileFilter })

const upload = multer({ 
    dest: path.join(__dirname, '..', 'uploads', 'docs'),
    limits:  {
        fileSize: 1000000 // bytes, 1000000bytes = 1MB
    },
    fileFilter(req, file, cb) {
        console.log(file)
        // if (file.mimetype == 'file/txt' || file.mimetype == 'file/pdf') {
        if (file.originalname.endsWith('.txt')  
            || file.originalname.match(/\.doc(x){0,1}$/gm)
            || file.originalname.endsWith('.pdf')
            || file.originalname.match(/\.jpg|jpeg|png$/gm) 
        )
        {
            cb(null, true);
        } else {
            cb(new Error('Please must be either txt, doc, docx, pdf, jpeg or png'));
            // cb(undefined, true);
        }
    }
})

router.route('/upload')
    .get(getTask);

router.route('/upload')
    .post(upload.single('upload'), uploadFile);

module.exports = router;