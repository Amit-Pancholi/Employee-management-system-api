require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const employeeRoute = require("./routes/employee-routes");
const departmentRoute = require("./routes/department-routes");
const sectionRoute = require("./routes/section-routes");
const taskRoute = require("./routes/task-routes");
const authRoutes = require("./routes/auth-routes");
const auth = require('./middleware/auth')


const app = express();

app.use(express.json());

// use routes
app.use('/api/auth',authRoutes)
app.use("/api/employees",auth, employeeRoute);
app.use("/api/departments",auth, departmentRoute);
app.use("/api/sections",auth, sectionRoute);
app.use("/api/tasks",auth, taskRoute);

app.use((req, res, next) => {
  res.status(404).json({ Message: "404 : Request not found" });
});

  module.exports = app;