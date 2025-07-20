const mongoose = require("mongoose");

sectionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Section',sectionSchema)