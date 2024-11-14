const { TaskModel } = require("../models/taskmodel.js");
const HttpError = require("../utils/http");

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


/**
 *   {
 *      nawe
 *      description
 *   }
 */