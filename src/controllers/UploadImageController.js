const Cloudinary = require("../utils/cloudinary.js");

const uploadImages = async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) =>
      Cloudinary.uploader.upload(file.path, { folder: "CTU-Work" })
    );

    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map((result) => result.secure_url);

    res.status(200).json({
      success: true,
      message: "Uploaded!",
      imageUrls: imageUrls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error uploading images",
    });
  }
};

module.exports = { uploadImages };
