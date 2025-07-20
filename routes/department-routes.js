const express = require("express");
const controller = require("../controllers/department-controller");
const departmentRoute = express.Router();

departmentRoute.get("/", controller.getDepartmentList);
departmentRoute.get("/:id", controller.getDepartmentById);
departmentRoute.post("/", controller.postDepartmentAdd);
departmentRoute.put("/:id", controller.putDepartmentUpdate);
departmentRoute.delete("/:id", controller.deleteDepartmentById);

module.exports = departmentRoute;
