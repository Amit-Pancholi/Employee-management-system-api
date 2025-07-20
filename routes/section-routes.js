const express = require("express");
const controller = require("../controllers/section-controller");
const sectionRoute = express.Router();

sectionRoute.get("/", controller.getSectionList);
sectionRoute.get("/:id", controller.getSectionById);
sectionRoute.get("/department/:deptId", controller.getSectionByDepartment);
sectionRoute.post("/", controller.postSectionAdd);
sectionRoute.put("/:id", controller.putSectionUpdate);
sectionRoute.delete("/:id", controller.deleteSectionById);

module.exports = sectionRoute;
