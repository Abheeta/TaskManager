const { TaskListModel } = require("../models/tasklistmodel.js");
const { TaskModel } = require("../models/taskmodel.js");
const HttpError = require("../utils/http");
const mongoose = require("mongoose");

const createTask = async(req, res, next) => {

    try {
        const {name, description, tasklistId}  = req.body;
        const userId = req.user._id;


        if (!name) {
            throw  HttpError.badRequest("Name is required");
        }
        
        if (typeof name !== "string") {
            throw  HttpError.badRequest("Name must be a string");
        }
        
        if (typeof description !== "string" && typeof description !== "undefined") {
            throw  HttpError.badRequest("Description must be a string");
        }
        
        if (!tasklistId) {
            throw  HttpError.badRequest("tasklistId is required");
        }
        
        if (!mongoose.Types.ObjectId.isValid(tasklistId)) {
            throw  HttpError.badRequest("tasklistId must be a valid ObjectId");
        }


        const newtask = await TaskModel.create({name: name, description: description, tasklist: tasklistId, user:userId});

        const updatedTaskList = await TaskListModel.findByIdAndUpdate(
            tasklistId,
            {
              $push: {
                tasks: {
                  $each: [newtask._id],
                  $position: 0 // Adds the element to the start of the array
                }
              }
            },
            { new: true } // Option to return the updated document
          );

        res.status(201).json({
            message: "task created successfully, and tasklist updated",
            task: newtask
        });

    } catch (err) {
        next(err);
    }

}

const getTaskListbyUserId = async(req, res, next) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            throw new HttpError.badRequest("UserId is required");
        }
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new HttpError.badRequest("UserId must be a valid ObjectId");
        }
    
        const tasklists = await TaskListModel.find({ user: userId }).populate('tasks').lean().exec();
        console.log("Fetched tasklists:", tasklists);

        
    
        if (!tasklists || tasklists.length === 0) {
            throw HttpError.notFound("No tasklists found for this user");
        }
    
        res.status(200).json({
            message: "Tasklists are successfully fetched",
            tasklists: tasklists
        });
    } catch (err) {
        console.error("Error occurred: ", err);
        next(err);
    }
    
};


module.exports = {
    createTask,
    getTaskListbyUserId
}


/**
 *   {
 *      nawe
 *      description
 *   }
 */