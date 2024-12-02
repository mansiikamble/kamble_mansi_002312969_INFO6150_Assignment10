const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: Number, required: true },
});

module.exports = mongoose.model('Job', JobSchema);