const express = require("express");
const controller = require("../controllers/section-controller");
const sectionRoute = express.Router();

sectionRoute.get("/api/sections", controller.getSectionList);
sectionRoute.get("/api/sections/:id", controller.getSectionById);
sectionRoute.get(
  "/api/sections/department/:deptId",
  controller.getSectionByDepartment
);
sectionRoute.post("/api/sections/create", controller.postSectionAdd);
sectionRoute.put("/api/sections/update/:id", controller.putSectionUpdate);
sectionRoute.delete("/api/sections/remove/:id", controller.deleteSectionRemove);

module.exports = sectionRoute;
