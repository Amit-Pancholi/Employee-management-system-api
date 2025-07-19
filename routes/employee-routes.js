const express = require('express')
const controller = require('../controllers/employee-controller')
const employeeRoute = express.Router();

employeeRoute.get("/api/employees",controller.getEmployeeList);
employeeRoute.get("/api/employees/:id",controller.getEmployeeById);
employeeRoute.get("/api/employees/role/:role",controller.getEmployeeByRole);
employeeRoute.get("/api/employees/department/:deptId",controller.getEmployeeByDepartment);
employeeRoute.get("/api/employees/section/:secId",controller.getEmployeeBySection);
employeeRoute.post("/api/employees/create",controller.postEmployeeAdd);
employeeRoute.put("/api/employees/update/:id",controller.putEmployeeUpdate);
employeeRoute.delete("/api/employees/remove/:id", controller.deleteEmployeeRemove);

module.exports = employeeRoute