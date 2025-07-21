const mongoose = require('mongoose');

departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    isDelete :{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department',departmentSchema)