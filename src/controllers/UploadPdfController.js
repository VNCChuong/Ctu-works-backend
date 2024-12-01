const Cloudinary = require("../utils/cloudinary.js");

const uploadPdfs = async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) =>
      Cloudinary.uploader.upload(file.path, {
        folder: "CTU-Work",
        resource_type: "raw",
        format: "pdf",
        use_filename: true,
        unique_filename: false,
      })
    );

    const results = await Promise.all(uploadPromises);

    const pdfUrls = results.map((result) => result.secure_url);

    res.status(200).json({
      success: true,
      message: "Uploaded!",
      pdfUrls: pdfUrls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error uploading PDFs",
      error: err.message,
    });
  }
};

module.exports = { uploadPdfs };
