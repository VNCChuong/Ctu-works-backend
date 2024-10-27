const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Thống kê người dùng
    totalUsers: {
      type: Number,
      required: true,
    },
    newUsersThisMonth: {
      type: Number,
      required: true,
    },

    // Thống kê tin tuyển dụng
    newJobPostsThisMonth: {
      type: Number,
      required: true,
    },

    // Thống kê ứng tuyển
    totalApplications: {
      type: Number,
      required: true,
    },

    // Thời gian thống kê
    reportDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Thay đổi phần trăm so với tháng trước
    userGrowthRate: {
      type: Number,
      default: 0,
    },
    newUserGrowthRate: {
      type: Number,
      default: 0,
    },
    jobPostGrowthRate: {
      type: Number,
      default: 0,
    },
    applicationGrowthRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
