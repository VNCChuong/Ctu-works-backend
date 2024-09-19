const express = require("express");
const AdminController = require("../controllers/AdminController");
const { asyncHandler } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/new-users/:timeRange",
  asyncHandler(AdminController.getNumberOfNewUsers)
);

router.get(
  "/new-job-posts/:timeRange",
  asyncHandler(AdminController.getNumberOfNewJobPosts)
);

router.get(
  "/job-application-count/:jobId",
  asyncHandler(AdminController.getJobApplicationCount)
);

router.get(
  "/job-post-view-count/:jobId",
  asyncHandler(AdminController.getJobPostViewCount)
);

router.put(
  "/approve-job-post/:jobId",
  asyncHandler(AdminController.approveJobPost)
);

router.put(
  "/reject-job-post/:jobId",
  asyncHandler(AdminController.rejectJobPost)
);

module.exports = router;
