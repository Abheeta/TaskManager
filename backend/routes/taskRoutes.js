const express = require('express');

const router = express.Router();

const {createTask, getTaskListbyUserId, deleteTask, updateTaskDetails, reorderTasks} = require("../controllers/taskController.js");

router.post('/task', createTask);

router.patch("/task/:taskId", updateTaskDetails);

router.delete("/task/:taskId", deleteTask);

router.post("/task/reorder", reorderTasks);

router.get('/tasklist', getTaskListbyUserId);

module.exports = router;
