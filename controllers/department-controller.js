const Department = require("../models/department-model");
exports.getDepartmentList = async (req, res, next) => {
  try {
    const department = await Department.find();
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
    const department = await Department.findById(departmentId);

    if (!department)
      return res.status(404).json({ Message: "Department not found" });
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching department",
      error: error.message,
    });
  }
};
exports.postDepartmentAdd = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const deptExist = await Department.findOne({ name: name });

    if (deptExist)
      return res.status(200).json({ Message: "Department Exist", deptExist });
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
};
exports.putDepartmentUpdate = async (req, res, next) => {
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
};
exports.deleteDepartmentById = async (req, res, next) => {
  try {
    const departmentId = req.params.id;
    const department = await Department.findByIdAndDelete(departmentId);
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
