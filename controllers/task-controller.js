const Task = require("../models/task-model");
const Employee = require("../models/employee-model");
exports.getTaskList = async (req, res, next) => {
  try {
    const task = await Task.find().populate("employee", "name");
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching task",
      error: error.message,
    });
  }
};
exports.getTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate("employee");
    if (!task)
      return res.status(400).json({ Message: "Bad request : task not find" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching task",
      error: error.message,
    });
  }
};
exports.getTaskByEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.empId;
    const task = await Task.find({ employee: employeeId }).populate(
      "employee",
      "name"
    );
    if (!task)
      return res.status(400).json({ Message: "Bad request : task not find" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching task",
      error: error.message,
    });
  }
};
exports.postTaskAdd = async (req, res, next) => {
  try {
    const { taskName, description, status, employee } = req.body;
    const emplExist = await Employee.findById(employee);
    if (!emplExist)
      return res.status(404).json({ Message: "Employee not found" });

    const task = new Task({
      taskName,
      description,
      status,
      employee,
    });
    await task.save();

    res.status(201).json({ Message: "task create successfully", task });
  } catch (error) {
    res.status(500).json({
      Message: "ERROR creating task",
      error: error.message,
    });
  }
};
exports.putTaskUpdate = async (req, res, next) => {
  try {
    const { taskName, description, status, employee } = req.body;
    const emplExist = await Employee.findById(employee);
    if (!emplExist)
      return res.status(400).json({ Message: "Invalid Employee" });

    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task)
      return res.status(400).json({ Message: "Bad request : task not find" });

    task.taskName = taskName;
    task.description = description;
    task.status = status;
    task.employee = employee;
    await task.save();

    res.status(200).json({ Message: "task update successfully", task });
  } catch (error) {
    res.status(500).json({
      Message: "ERROR updating task",
      error: error.message,
    });
  }
};
exports.deleteTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);
    res.status(200).json({ Message: "task remove successfully", task });
  } catch (error) {
    res.status(500).json({
      Message: "ERROR removing task",
      error: error.message,
    });
  }
};
