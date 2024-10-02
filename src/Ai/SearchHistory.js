const jobPost = require('../models/JobPostModel');

const searchHistory = async (req, res) => {
  try {
    const keyword = req.body; // Make search case-insensitive
    
    // Use Mongoose's powerful query functionality
    const results = await jobPost.find({
      $or: [
        // { title: { $regex: keyword, $options: 'i' } },
        // { 'jobInformation.keywords': { $regex: keyword, $options: 'i' } },
        { 'jobInformation.jobField': { $regex: keyword, $options: 'i' } },
        // { description: { $regex: keyword, $options: 'i' } },
      ]
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred while processing search request' });
  }
};

module.exports = {
  searchHistory
};