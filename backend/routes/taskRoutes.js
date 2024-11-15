const express = require('express');

const router = express.Router();

const {createTask, getTaskListbyUserId} = require("../controllers/taskController.js");

router.post('/task', createTask);

router.get('/tasklist', getTaskListbyUserId);

module.exports = router;
