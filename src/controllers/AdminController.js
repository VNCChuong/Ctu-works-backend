const AdminService = require("../services/AdminService");

const getNumberOfNewUsers = async (req, res) => {
  return res
    .status(200)
    .json(await AdminService.getNumberOfNewUsers(req.params.timeRange));
};

const getNumberOfNewJobPosts = async (req, res) => {
  return res
    .status(200)
    .json(await AdminService.getNumberOfNewJobPosts(req.params.timeRange));
};

const getJobApplicationCount = async (req, res) => {
  return res
    .status(200)
    .json(await AdminService.getJobApplicationCount(req.params.jobId));
};

const getJobPostViewCount = async (req, res) => {
  return res
    .status(200)
    .json(await AdminService.getJobPostViewCount(req.params.jobId));
};

const approveJobPost = async (req, res) => {
  return res
    .status(200)
    .json(await AdminService.approveJobPost(req.params.jobId));
};

const rejectJobPost = async (req, res) => {
  return res
    .status(200)
    .json(await AdminService.rejectJobPost(req.params.jobId));
};

module.exports = {
  getNumberOfNewUsers,
  getNumberOfNewJobPosts,
  getJobApplicationCount,
  getJobPostViewCount,
  approveJobPost,
  rejectJobPost,
};
