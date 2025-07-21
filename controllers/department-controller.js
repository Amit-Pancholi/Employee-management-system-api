const Department = require("../models/department-model");
const { check, validationResult } = require("express-validator");

exports.getDepartmentList = async (req, res, next) => {
  try {
    const department = await Department.find({ isDelete: false });
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching department",
      error: error.message,
    });
  }
};
exports.getDepartmentById = async (req, res, next) => {
  try {
    const departmentId = req.params.id;
    const department = await Department.findOne({
      _id: departmentId,
      isDelete: false,
    });

    if (!department)
      return res
        .status(404)
        .json({ Message: "Department not found or removed" });
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching department",
      error: error.message,
    });
  }
};
exports.postDepartmentAdd = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter name")
    .isLength({
      min: 2,
    })
    .withMessage("Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        Message: "Error occure in sending data",
        error: error.array().map((err) => err.msg),
      });
    } else {
      next();
    }
  },

  async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const deptExist = await Department.findOne({
        name: name,
        isDelete: false,
      });

      if (deptExist)
        return res.status(409).json({ Message: "Department Exist", deptExist });
      const department = new Department({
        name,
        description,
      });
      await department.save();
      res
        .status(201)
        .json({ Message: "Department created successfully", department });
    } catch (error) {
      res.status(500).json({
        Message: "ERROR creating department",
        error: error.message,
      });
    }
  },
];
exports.putDepartmentUpdate = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter name")
    .isLength({
      min: 2,
    })
    .withMessage("Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        Message: "Error occure in sending data",
        error: error.array().map((err) => err.msg),
      });
    } else {
      next();
    }
  },
  async (req, res, next) => {
    const departmentId = req.params.id;
    const { name, description } = req.body;
    const department = await Department.findById(departmentId);

    if (!department)
      return res
        .status(400)
        .json({ Message: "bad request : department not found" });
    department.name = name;
    department.description = description;

    await department.save();
    res
      .status(200)
      .json({ Message: "department update successfully", department });
  },
];
exports.deleteDepartmentById = async (req, res, next) => {
  try {
    const departmentId = req.params.id;
    const department = await Department.findById(departmentId);
    if (!department)
      return res.status(400).json({ Message: "invalid department" });
    department.isDelete = true;
    await department.save();
    res
      .status(200)
      .json({ Message: "remove department successfully", department });
  } catch (error) {
    res.status(500).json({
      Message: "ERROR removing department",
      error: error.message,
    });
  }
};
