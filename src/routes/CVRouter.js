// routes/cvTemplates.js
const express = require("express");
const router = express.Router();
const CvTemplate = require("../models/CVTemplateModel");

router.post("/create", async (req, res) => {
  try {
    const { templateName, fileUrl, imageUrl } = req.body;

    if (!templateName || !fileUrl || !imageUrl) {
      return res
        .status(400)
        .json({ message: "templateName và fileUrl là bắt buộc!" });
    }

    const newTemplate = new CvTemplate({
      templateName,
      fileUrl,
      imageUrl,
    });

    const savedTemplate = await newTemplate.save();
    res
      .status(201)
      .json({ message: "Mẫu CV đã được lưu!", data: savedTemplate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lưu mẫu CV!", error: error.message });
  }
});

router.get("/list", async (req, res) => {
  try {
    const templates = await CvTemplate.find();
    res.status(200).json({ templates });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách mẫu CV!", error: error.message });
  }
});

module.exports = router;
