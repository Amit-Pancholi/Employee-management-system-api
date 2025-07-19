const mongoose = require("mongoose");

taskSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
