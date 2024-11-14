const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: {
        type:'String',
    
    },
    firstName: {
        type:'String',
        required: true,
    
    },
    lastName: {
        type:'String',
        required: true,
    
    },
    email: {
        type:'String',
        required: true,
    },

    password: {
        type: String,
      },

    salt: {
        type: String,
        required: true
    },

    avatar:{
        type: String,
    },
    
    tasklists: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'tasklist',
        default: []
    },

    

}, {timestamps: true})


const UserModel  = mongoose.model('user', userSchema);

module.exports = {
    UserModel
}


