const { TaskListModel } = require("../models/tasklistmodel.js");
const { TaskModel } = require("../models/taskmodel.js");
const HttpError = require("../utils/http");
const mongoose = require("mongoose");

const createTask = async(req, res, next) => {

    try {
        const {name, description, tasklistId}  = req.body;

        if (!name) {
            throw new HttpError.badRequest("Name is required");
        }
        
        if (typeof name !== "string") {
            throw new HttpError.badRequest("Name must be a string");
        }
        
        if (typeof description !== "string" && typeof description !== "undefined") {
            throw new HttpError.badRequest("Description must be a string");
        }
        
        if (!tasklistId) {
            throw new HttpError.badRequest("tasklistId is required");
        }
        
        if (!mongoose.Types.ObjectId.isValid(tasklistId)) {
            throw new HttpError.badRequest("tasklistId must be a valid ObjectId");
        }
        

        const newtask = TaskModel.create({})

    } catch (err) {
        next(err);
    }

}

const getTaskListbyUserId = async(req, res, next) => {
    try {
        const {userId} = req.query;
        console.log(userId);
        if (!userId) {
            throw new HttpError.badRequest("UserId is required");
        }
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new HttpError.badRequest("UserId must be a valid ObjectId");
        }
    
        const tasklists = await TaskListModel.find({ user: userId }).lean().exec();
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