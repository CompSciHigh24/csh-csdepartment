const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  studentName: { type: String, required: false },
  grade: { type: Number, required: false },
  yearMade: { type: Number, required: true },
  projectDescription: { type: String, required: true },
  projectImg: { type: String, required: false },
  projectURL: { type: String, required: false },
  coursePage: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});


module.exports = mongoose.model('Project', projectSchema, 'projects')