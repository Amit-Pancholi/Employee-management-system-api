const Section = require("../models/section-model");
const Department = require("../models/department-model");
exports.getSectionList = async (req, res, next) => {
  try {
    const section = await Section.find().populate("department", "name");
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching section",
      error: error.message,
    });
  }
};
exports.getSectionById = async (req, res, next) => {
  try {
    const sectionId = req.params.id;
    const section = await Section.findById(sectionId).populate(
      "department",
      "name"
    );
    if (!section) return res.status(404).json({ Message: "section not found" });
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching section",
      error: error.message,
    });
  }
};
exports.getSectionByDepartment = async (req, res, next) => {
  try {
    const departmentId = req.params.id;
    const section = await Section.find({ department: departmentId }).populate(
      "department",
      "name"
    );
    if (!section)
      return res
        .status(400)
        .json({ Message: "bad request : section not find" });
        res.status(200).json(section)
  } catch (error) {
    res.status(500).json({
      Message: "ERROR fetching section",
      error: error.message,
    });
  }
};
exports.postSectionAdd = async (req, res, next) => {
  try {
    const { name, department } = req.body;

    const deptExist = await Department.findById(department);
    if (!deptExist)
      return res.status(400).json({ Message: "Invalid Department" });

    const secExist = await Section.findOne({ name: name });
    if (secExist)
      return res.status(200).json({ Message: "Section Exist", secExist });

    const section = new Section({
      name,
      department,
    });
    await section.save();
    res.status(201).json({ Message: "Section created successfully", section });
  } catch (error) {
    res.status(500).json({
      Message: "ERROR creating section",
      error: error.message,
    });
  }
};
exports.putSectionUpdate = async (req, res, next) => {
  try {
    const { name, department } = req.body;
    const deptExist = await Department.findById(department);
    if (!deptExist)
      return res.status(400).json({ Message: "Invalid department" });

    const sectionId = req.params.id;
    const section = await Section.findById(sectionId);
    if (!section) return res.status(400).json({ Message: "Invalid section" });

    section.name = name;
    section.department = department;

    await section.save();

    res.status(200).json({ Message: "section update successfully", section });
  } catch (error) {
    res.status(500).json({
      Message: "ERROR updating section",
      error: error.message,
    });
  }
};
exports.deleteSectionById = async (req, res, next) => {
  try {
    const sectionId = req.params.id;
    const section = await Section.findByIdAndDelete(sectionId);

    res.status(200).json({ Message: "Section remove successfully", section });
  } catch (error) {
    res.status(500).json({
      Message: "ERROR removing section",
      error: error.message,
    });
  }
};
