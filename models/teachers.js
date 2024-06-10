const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  staffName: {type: String, required: true},
  staffTitle: {type: String, required: false},
  staffBio: {type: String, required: true},
  staffImg: {type: String, required: false}
})

module.exports = mongoose.model('Staff', staffSchema, 'teachers')