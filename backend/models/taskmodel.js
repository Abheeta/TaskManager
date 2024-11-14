const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    name: {
        type:'String',
        required: true,
    
    },
    description: {
        type:'String',
        required: true,
        default: ''
    
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    },
    tasklist: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'tasklist',
      
    }

}, {timestamps: true})


const TaskModel  = mongoose.model('task', taskSchema);

module.exports = {
    TaskModel
}


