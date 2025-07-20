require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const employeeRoute = require("./routes/employee-routes");
const departmentRoute = require("./routes/department-routes");
const sectionRoute = require("./routes/section-routes");
const taskRoute = require("./routes/task-routes");

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

// use routes
app.use("/api/employees", employeeRoute);
app.use("/api/departments", departmentRoute);
app.use("/api/sections", sectionRoute);
app.use("/api/tasks", taskRoute);

app.use((req, res, next) => {
  res.status(404).json({ Message: "404 : Request not found" });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(
        `🚀 Server started on port ${PORT}` + " " + `http://localhost:${PORT}`
      )
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));


