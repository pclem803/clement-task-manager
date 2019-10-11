const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: false,
        default: 'Other'
    },
    date: {
        type: Number,
        required: true
    },
    start:{
        type:Number,
        required: false
    },
    end: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})


const Task = mongoose.model('Task', taskSchema)

module.exports = Task