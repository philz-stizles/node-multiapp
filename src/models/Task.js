const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: false, trim: true },
    startAt: { type: Date },
    dueAt: { type: Date },
    status: { type: Boolean, enum: ['completed', 'validating'] },
    completed: { type: Boolean, required: true, default: false },
    docs: [{ 
        uri: { type: String, required: true } 
    }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // the ref is ties the Task to a User
    // It enables us to be able to populate User data based on the ObjectId
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }]
}, { timestamps: true }) // timestamps: true => will automatically create fields for createdAt and updatedAt

module.exports = Task = mongoose.model('Tasks', TaskSchema)