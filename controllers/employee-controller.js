const Employee = require("../models/employee-model");
const Department = require("../models/department-model");
const Section = require("../models/section-model");

exports.getEmployeeList = async (req, res, next) => {
  try {
    const employee = await Employee.find()
      .populate("department", "name")
      .populate("section", "name");
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    const employee = await Employee.findById(employeeId)
      .populate("department", "name")
      .populate("section", "name");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
exports.getEmployeeByRole = async (req, res, next) => {
  try {
    const employeeRole = req.params.role;
    const employee = await Employee.find({ role: employeeRole })
      .populate("department", "name")
      .populate("section", "name");
    if (!employee) return res.status(400).json({ Message: "Invalid Role" });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
exports.getEmployeeByDepartment = async (req, res, next) => {
  try {
    const departmentId = req.params.deptId;
    const employee = await Employee.find({ department: departmentId })
      .populate("department", "name")
      .populate("section", "name");
    if (!employee)
      return res.status(400).json({ Message: "Invalid Department" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
exports.getEmployeeBySection = async (req, res, next) => {
  try {
    const sectionId = req.params.secId;

    const employee = await Employee.find({ section: sectionId })
      .populate("department", "name")
      .populate("section", "name");

    if (!employee) return res.status(400).json({ Message: "Invalid section" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
exports.postEmployeeAdd = async (req, res, next) => {
  try {
    const { name, role, phone, email, department, section } = req.body;

    const deptExist = await Department.findById(department);
    const secExist = await Section.findById(section);

    if (!deptExist)
      return res.status(400).json({ Message: "Invalid Department" });
    if (!secExist) return res.status(400).json({ Message: "Invalid Section" });

    const employee = new Employee({
      name,
      role,
      phone,
      email,
      department,
      section,
    });

    await employee.save();
    res.status(201).json({ Message: "Employee created", employee });
  } catch (error) {
    res.status(500).json({
      message: "Error employee Creating",
      error: error.message,
    });
  }
};
exports.putEmployeeUpdate = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);
    const { name, role, phone, email, department, section } = req.body;
    if (!employee) return res.status(400).json({ Message: "Invalid Employee" });

    const deptExist = await Department.findById(department);
    const secExist = await Section.findById(section);

    if (!deptExist)
      return res.status(400).json({ Message: "Invalid Department" });
    if (!secExist) return res.status(400).json({ Message: "Invalid Section" });

    employee.name = name;
    employee.role = role;
    employee.phone = phone;
    employee.email = email;
    employee.department = department;
    employee.section = section;

    await employee.save();

    res
      .status(200)
      .json({ Message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({
      message: "Error updating employee",
      error: error.message,
    });
  }
};
exports.deleteEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findByIdAndDelete(employeeId);

    res.status(200).json({ Message: "Successfully remove employee", employee });
  } catch (error) {
    res.status(500).json({
      message: "Error delete employee",
      error: error.message,
    });
  }
};
