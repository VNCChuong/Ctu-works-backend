const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const UploadImageController = require("../controllers/UploadImageController");

router.post(
  "/image",
  upload.array("images"),
  UploadImageController.uploadImages
);

module.exports = router;
