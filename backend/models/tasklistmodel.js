const mongoose = require("mongoose");

const taskListSchema = new mongoose.Schema({
    name:{
        type:'String',
        required: true
    
    },
    
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    },

    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'task',
        default: []
    },
    
    

}, {timestamps: true})


const TaskListModel  = mongoose.model('tasklist', taskListSchema);

module.exports = {
    TaskListModel
}


