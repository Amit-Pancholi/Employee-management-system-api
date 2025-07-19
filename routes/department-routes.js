const express = require("express");
const controller = require("../controllers/department-controller");
const departmentRoute = express.Router();

departmentRoute.get("/api/departments", controller.getDepartmentList);
departmentRoute.get("/api/departments/:id", controller.getDepartmentById);
departmentRoute.post("/api/departments/create", controller.postDepartmentAdd);
departmentRoute.put(
  "/api/departments/update/:id",
  controller.putDepartmentUpdate
);
departmentRoute.delete(
  "/api/departments/remove/:id",
  controller.deleteDepartmentRemove
);

module.exports = departmentRoute;
