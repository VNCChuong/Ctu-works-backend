const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");

// Route để tạo báo cáo mới
router.post("/", reportController.createReport);

// Route để lấy báo cáo mới nhất
router.get("/latest", reportController.getLatestReport);

// Route để lấy danh sách tất cả các báo cáo
router.get("/", reportController.getReports);

// Route để lấy thống kê hàng tháng
router.get("/monthly-stats", reportController.getMonthlyStats);

module.exports = router;
