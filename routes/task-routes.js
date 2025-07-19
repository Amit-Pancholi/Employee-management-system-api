const express = require('express')
const controller = require('../controllers/task-controller')
const taskRoute = express.Router();

taskRoute.get("/api/tasks", controller.getTaskList);
taskRoute.get("/api/tasks/:id", controller.getTaskById);
taskRoute.get("/api/tasks/section/:sectionId", controller.getTaskBySection);

taskRoute.post("/api/tasks/create", controller.postTaskAdd);
taskRoute.put("/api/tasks/update/:id", controller.putTaskUpdate);
taskRoute.delete("/api/tasks/remove/:id", controller.deleteTaskRemove);

module.exports = taskRoute