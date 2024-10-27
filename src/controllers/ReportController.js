const reportService = require("../services/ReportService");
const Report = require("../models/ReportModel");

/**
 * API để tạo báo cáo mới
 */
const createReport = async (req, res) => {
  try {
    const report = await reportService.generateReport();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * API để lấy báo cáo mới nhất
 */
const getLatestReport = async (req, res) => {
  try {
    const report = await reportService.getLatestReport();
    if (!report) {
      return res.status(404).json({ message: "Không tìm thấy báo cáo nào" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * API để lấy tất cả các báo cáo
 */
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ reportDate: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * API để lấy số liệu người dùng và bài đăng tuyển theo từng tháng trong năm nay
 */
const getMonthlyStats = async (req, res) => {
  try {
    const stats = await reportService.getMonthlyStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getLatestReport,
  getReports,
  getMonthlyStats,
};
