const express = require("express");
const controller = require("../controllers/employee-controller");
const employeeRoute = express.Router();

employeeRoute.get("/", controller.getEmployeeList);
employeeRoute.get("/:id", controller.getEmployeeById);
employeeRoute.get("/role/:role", controller.getEmployeeByRole);
employeeRoute.get("/department/:deptId", controller.getEmployeeByDepartment);
employeeRoute.get("/section/:secId", controller.getEmployeeBySection);
employeeRoute.post("/", controller.postEmployeeAdd);
employeeRoute.put("/:id", controller.putEmployeeUpdate);
employeeRoute.delete("/:id", controller.deleteEmployeeById);

module.exports = employeeRoute;
