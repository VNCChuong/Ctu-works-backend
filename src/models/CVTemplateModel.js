const mongoose = require("mongoose");

const CvTemplateSchema = new mongoose.Schema({
  templateName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const CvTemplate = mongoose.model("CvTemplate", CvTemplateSchema);
module.exports = CvTemplate;
