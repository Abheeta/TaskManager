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

const updateTaskDetails = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const taskId = req.params.taskId;
        const userId = req.user._id;

        if (!taskId) {
            throw HttpError.badRequest("taskId is required");
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw HttpError.badRequest("taskId must be a valid ObjectId");
        }

        if (name !== undefined) {
            if (typeof name !== "string") {
                throw HttpError.badRequest("Name must be a string");
            }
            if (name.trim() === "") {
                throw HttpError.badRequest("Name cannot be an empty field");
            }
        }

        if (description !== undefined && typeof description !== "string") {
            throw HttpError.badRequest("Description must be a string");
        }

        const updateFields = {};
        if (name) updateFields.name = name;
        if (description) updateFields.description = description;

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: taskId, user: userId },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedTask) {
            throw HttpError.notFound("Task not found or not authorized to update");
        }

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });
    } catch (err) {
        console.error("Error occurred while updating task: ", err);
        next(err);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.user._id;

        if (!taskId) {
            throw HttpError.badRequest("taskId is required");
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw HttpError.badRequest("taskId must be a valid ObjectId");
        }

        const taskObjectId = new mongoose.Types.ObjectId(taskId);

        const task = await TaskModel.findOne({ _id: taskObjectId, user: userId });

        if (!task) {
            throw HttpError.notFound("Task not found or not authorized to delete");
        }

        await TaskModel.deleteOne({ _id: taskObjectId, user: userId });

        await TaskListModel.findByIdAndUpdate(
            task.tasklist,
            {
                $pull: { tasks: taskObjectId }
            }
        );

        res.status(200).json({
            message: "Task deleted successfully and removed from task list"
        });
    } catch (err) {
        console.error("Error occurred while deleting task: ", err);
        next(err);
    }
};

const getTaskListbyUserId = async(req, res, next) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            throw HttpError.badRequest("UserId is required");
        }
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw HttpError.badRequest("UserId must be a valid ObjectId");
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

const reorderTasks = async (req, res, next) => {
    try {
        const { sourceListId, destListId, taskId, destinationTaskId } = req.body;

        // Fetch the source and destination task lists from the database
        const sourceList = await TaskListModel.findById(sourceListId);
        const destList = sourceListId === destListId ? sourceList : await TaskListModel.findById(destListId);

        if (!sourceList || !destList) {
            throw HttpError.badRequest("Task list not found");
        }

        // Remove the task from the source list
        const taskIndex = sourceList.tasks.findIndex(task => task._id.toString() === taskId);
        if (taskIndex === -1) {
            throw HttpError.badRequest('Task not found in the source list');
        }
        const [movedTask] = sourceList.tasks.splice(taskIndex, 1);

        // Insert the task into the destination list before/after the destination task ID
        if (destinationTaskId) {
            const destIndex = destList.tasks.findIndex(task => task._id.toString() === destinationTaskId);
            if (destIndex === -1) {
                throw HttpError.badRequest('Destination task not found');
            }

            // Insert the moved task before the found destination task
            destList.tasks.splice(destIndex, 0, movedTask);
        } else {
            // If destinationTaskId is null or not provided, append to the end
            destList.tasks.push(movedTask);
        }

        // Save the updated task lists
        await sourceList.save();
        if (sourceListId !== destListId) {
            await destList.save();
        }

        res.status(200).json({ message: 'Task reordered successfully', tasklists: [sourceList, destList] });
    } catch (err) {
        console.error("Error occurred while reordering tasks: ", err);
        next(err);
    }
};



module.exports = {
    createTask,
    getTaskListbyUserId,
    updateTaskDetails,
    deleteTask,
    reorderTasks,
}


/**
 *   {
 *      nawe
 *      description
 *   }
 */