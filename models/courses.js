const mongoose = require("mongoose");



const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseGrade: { type: Number, required: true },
  courseDescription: { type: String, required: true},
  possibleCareerpath: { type: String, required: false},

});




module.exports = mongoose.model("Course", courseSchema, "courses");
