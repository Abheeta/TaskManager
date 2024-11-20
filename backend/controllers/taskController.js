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

const getTaskListbyUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { search, sortBy } = req.query;  // Capture the search and sort query parameters
    
        if (!userId) {
            throw HttpError.badRequest("UserId is required");
        }
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw HttpError.badRequest("UserId must be a valid ObjectId");
        }
    
        // Build the query for fetching tasklists
        let query = { user: userId };
    
        // Add search filter to the query if a search term is provided
        // if (search) {
        //     const searchRegex = new RegExp(search, 'i');  // Case-insensitive search
        //     query['tasks.name'] = { $regex: searchRegex };  // Assuming tasks have a 'name' field
        // }
    
        // Sorting
        let sort = {};
        if (sortBy === 'createdAt_asc') {
            sort.createdAt = 1;  // Ascending sort
        } else if (sortBy === 'createdAt_desc') {
            sort.createdAt = -1;  // Descending sort
        }
    
        // Fetch the tasklists and populate the tasks with the filter
        const tasklists = await TaskListModel.find(query)
            .populate({
                path: 'tasks',
                match: search ? { $or: [ { name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } } ] } : {},  // Filter tasks if search is present
                options: { sort }  // Apply sorting to tasks
            })
            .lean()
            .exec();
    
        if (!tasklists || tasklists.length === 0) {
            throw HttpError.notFound("No tasklists found for this user");
        }
  
        res.status(200).json({
            message: "Tasklists are successfully fetched",
            tasklists: tasklists,
        });
    } catch (err) {
        console.error("Error occurred: ", err);
        next(err);
    }
};
  

const reorderTasks = async (req, res, next) => {
    try {
        const { sourceListId, destListId, taskId, destinationTaskId } = req.body;

        // Validate user ID (assuming user is authenticated and `req.user` is available)
        const userId = req.user._id;
        if (!userId) {
            throw HttpError.badRequest("UserId is required");
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw HttpError.badRequest("UserId must be a valid ObjectId");
        }

        // Validate task list IDs
        if (!mongoose.Types.ObjectId.isValid(sourceListId) || !mongoose.Types.ObjectId.isValid(destListId)) {
            throw HttpError.badRequest("Both sourceListId and destListId must be valid ObjectIds");
        }

        // Validate taskId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw HttpError.badRequest("taskId must be a valid ObjectId");
        }

        // If destinationTaskId is provided, validate it
        if (destinationTaskId && !mongoose.Types.ObjectId.isValid(destinationTaskId)) {
            throw HttpError.badRequest("destinationTaskId must be a valid ObjectId");
        }

        // Fetch the source and destination task lists from the database
        const sourceList = await TaskListModel.findById(sourceListId).populate('tasks').lean().exec();
        const destList = sourceListId === destListId 
            ? sourceList 
            : await TaskListModel.findById(destListId).populate('tasks').lean().exec();

        if (!sourceList || !destList) {
            throw HttpError.notFound("Source or Destination task list not found");
        }

        // Ensure task exists in the source list
        const taskExists = sourceList.tasks.some(task => task._id.toString() === taskId);
        if (!taskExists) {
            throw HttpError.notFound("Task not found in the source list");
        }

        // If destinationTaskId is provided, ensure it's valid within the destination list
        if (destinationTaskId) {
            const destinationTaskExists = destList.tasks.some(task => task._id.toString() === destinationTaskId);
            if (!destinationTaskExists) {
                throw HttpError.notFound("Destination task not found in the destination list");
            }
        }

        // Now proceed to the reordering operation after validation
        const sourceTasks = Array.from(sourceList.tasks);
        const [movedTask] = sourceTasks.splice(sourceList.tasks.findIndex(task => task._id.toString() === taskId), 1);

        const destTasks = Array.from(destList.tasks);
        if (destinationTaskId) {
            const destinationIndex = destTasks.findIndex(task => task._id.toString() === destinationTaskId);
            destTasks.splice(destinationIndex, 0, movedTask);
        } else {
            destTasks.push(movedTask); // If no destinationTaskId, append to the end
        }

        // Save the updated task lists
        await TaskListModel.findByIdAndUpdate(sourceListId, { tasks: sourceTasks }).exec();
        if (sourceListId !== destListId) {
            await TaskListModel.findByIdAndUpdate(destListId, { tasks: destTasks }).exec();
        }

        res.status(200).json({ message: 'Task reordered successfully', tasklists: [sourceList, destList] });
    } catch (err) {
        console.error("Error occurred: ", err);
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