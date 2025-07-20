const express = require('express')
const controller = require('../controllers/task-controller')
const taskRoute = express.Router();

taskRoute.get("/", controller.getTaskList);
taskRoute.get("/:id", controller.getTaskById);
taskRoute.get("/employee/:empId", controller.getTaskByEmployee);
taskRoute.post("/", controller.postTaskAdd);
taskRoute.put("/:id", controller.putTaskUpdate);
taskRoute.delete("/:id", controller.deleteTaskById);

module.exports = taskRoute