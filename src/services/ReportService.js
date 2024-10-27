const User = require("../models/UserModel");
const JobPost = require("../models/JobPostModel");
const Apply = require("../models/ApplyModel");
const Report = require("../models/ReportModel");

/**
 * Lấy số liệu của tháng hiện tại và tháng trước
 */
const getMonthlyStatsForModel = async (Model, field = "createdAt") => {
  const currentMonth = new Date();
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const thisMonthCount = await Model.countDocuments({
    [field]: {
      $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
      $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    },
  });

  const lastMonthCount = await Model.countDocuments({
    [field]: {
      $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
      $lt: new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() + 1,
        1
      ),
    },
  });

  return { thisMonthCount, lastMonthCount };
};

/**
 * Tính tỷ lệ tăng trưởng (Growth Rate)
 */
const calculateGrowthRate = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Tạo báo cáo tự động
 */
const generateReport = async () => {
  try {
    const userStats = await getMonthlyStatsForModel(User);
    const totalUsers = await User.countDocuments();

    const jobPostStats = await getMonthlyStatsForModel(JobPost);
    const totalJobPosts = await JobPost.countDocuments();

    const applyStats = await getMonthlyStatsForModel(Apply);
    const totalApplications = await Apply.countDocuments();

    const userGrowthRate = calculateGrowthRate(
      userStats.thisMonthCount,
      userStats.lastMonthCount
    );
    const jobPostGrowthRate = calculateGrowthRate(
      jobPostStats.thisMonthCount,
      jobPostStats.lastMonthCount
    );
    const applicationGrowthRate = calculateGrowthRate(
      applyStats.thisMonthCount,
      applyStats.lastMonthCount
    );

    const report = new Report({
      totalUsers,
      newUsersThisMonth: userStats.thisMonthCount,
      newJobPostsThisMonth: jobPostStats.thisMonthCount,
      totalJobPosts,
      totalApplications,
      userGrowthRate,
      jobPostGrowthRate,
      applicationGrowthRate,
      reportDate: new Date(),
    });

    return await report.save();
  } catch (error) {
    throw new Error("Lỗi khi tạo báo cáo: " + error.message);
  }
};

/**
 * Lấy báo cáo mới nhất
 */
const getLatestReport = async () => {
  try {
    const latestReport = await Report.findOne().sort({ reportDate: -1 });
    return latestReport;
  } catch (error) {
    throw new Error("Lỗi khi lấy báo cáo mới nhất: " + error.message);
  }
};

/**
 * Lấy số liệu người dùng và bài đăng tuyển theo từng tháng từ đầu năm đến hiện tại
 */
const getMonthlyStats = async () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  try {
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          newUsers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          newUsers: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    const jobPostStats = await JobPost.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          newJobPosts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          newJobPosts: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    const allMonths = Array.from({ length: currentMonth }, (_, i) => i + 1);

    const combinedStats = allMonths.map((month) => {
      const userStat = userStats.find((stat) => stat.month === month) || {
        newUsers: 0,
      };
      const jobPostStat = jobPostStats.find((stat) => stat.month === month) || {
        newJobPosts: 0,
      };
      return {
        month,
        newUsers: userStat.newUsers,
        newJobPosts: jobPostStat.newJobPosts,
      };
    });

    return combinedStats;
  } catch (error) {
    throw new Error("Lỗi khi lấy thống kê theo tháng: " + error.message);
  }
};

module.exports = {
  generateReport,
  getLatestReport,
  getMonthlyStats,
};
