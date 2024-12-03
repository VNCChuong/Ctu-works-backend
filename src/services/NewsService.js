const News = require("../models/NewsModel");

const createNews = (newNews) => {
  return new Promise(async (resolve, reject) => {
    const { title, summary, content } = newNews;
    try {
      const createdNews = await News.create({
        title,
        summary,
        content,
      });
      if (createdNews) {
        resolve({
          status: "OK",
          message: "success",
          data: createdNews,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateNews = async (newNews) => {
  try {
    const { id, title, summary, content } = newNews;

    const news = await News.findById(id);

    if (!news) {
      return { status: "ERR", message: "The news is not defined" };
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { title, summary, content }, 
      { new: true }
    );

    if (updatedNews) {
      return { status: "OK", message: "success", data: updatedNews };
    } else {
      return { status: "ERR", message: "Failed to update news" };
    }
  } catch (error) {
    console.error("Error updating news:", error);
    return { status: "ERR", message: "An error occurred while updating the news", error: error.message };
  }
};

const deleteNews = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkNews = await News.findById({
        _id: id,
      });
      if (checkNews === null) {
        resolve({
          status: "ERR",
          message: "The News is not defined",
        });
      }
      await News.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete News success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailNews = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const news = await News.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $inc: {
            views: +1,
          },
        }
      ).sort({ createdAt: -1, updatedAt: -1 });
      if (news === null) {
        resolve({
          status: "ERR",
          message: "The News is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESSS",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllNews = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const news = await News.find().sort({ createdAt: -1, updatedAt: -1 });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getDetailNews,
  getAllNews,
};