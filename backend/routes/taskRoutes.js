const express = require('express');

const router = express.Router();

const {createTask, getTaskListbyUserId, deleteTask, updateTaskDetails} = require("../controllers/taskController.js");

router.post('/task', createTask);

router.patch("/task/:taskId", updateTaskDetails);

router.delete("/task/:taskId", deleteTask);

router.get('/tasklist', getTaskListbyUserId);

module.exports = router;
