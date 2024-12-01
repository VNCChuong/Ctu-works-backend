const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const UploadImageController = require("../controllers/UploadImageController");
const UploadPdfController = require("../controllers/UploadPdfController");

router.post(
  "/image",
  upload.array("images"),
  UploadImageController.uploadImages
);

router.post("/pdf", upload.array("pdfs"), UploadPdfController.uploadPdfs);

module.exports = router;
