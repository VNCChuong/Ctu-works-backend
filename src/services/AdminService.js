const User = require("../models/UserModel");
const JobPost = require("../models/JobPostModel");
const Apply = require("../models/ApplyModel");
const { NotFoundError } = require("../core/ErrorResponse");
const moment = require("moment");

const getNumberOfNewUsers = async (timeRange) => {
  const startTime = moment().subtract(timeRange, "days").startOf("day");
  const users = await User.find({
    createdAt: { $gte: startTime },
  });
  const count = users.length;
  return {
    status: "OK",
    message: "Success",
    data: {
      totalUsers: count,
      userList: users,
    },
  };
};

const getNumberOfNewJobPosts = async (timeRange) => {
  const startTime = moment().subtract(timeRange, "days").startOf("day");
  const jobPosts = await JobPost.find({
    createdAt: { $gte: startTime },
  });
  const count = jobPosts.length;
  if (count === 0) {
    throw new NotFoundError("No job posts found in the given time range");
  }
  return {
    status: "OK",
    message: "Success",
    data: {
      totalJobPosts: count,
      jobPostList: jobPosts,
    },
  };
};

const getJobApplicationCount = async (jobId) => {
  const jobPost = await JobPost.findById(jobId);
  if (jobPost === null) {
    throw new NotFoundError("Job post not found");
  }

  const applications = await Apply.find({ jobPostId: jobId });

  const applicationCount = applications.length;
  if (applicationCount === 0) {
    throw new NotFoundError("No applications found for this job post");
  }

  return {
    status: "OK",
    message: "Success",
    data: {
      totalApplications: applicationCount,
      applications: applications,
    },
  };
};

const getJobPostViewCount = async (jobId) => {
  const jobPost = await JobPost.findById(jobId);
  if (!jobPost) {
    throw new NotFoundError("Job post not found");
  }

  return {
    status: "OK",
    message: "Success",
    data: {
      totalViews: jobPost.postViews,
    },
  };
};

const approveJobPost = async (jobId) => {
  const jobPost = await JobPost.findByIdAndUpdate(
    jobId,
    { statusApproval: true },
    { new: true }
  );
  if (!jobPost) {
    throw new NotFoundError("Job post not found");
  }
  return {
    status: "OK",
    message: "Job post approved successfully",
    data: jobPost,
  };
};

const rejectJobPost = async (jobId) => {
  const jobPost = await JobPost.findByIdAndUpdate(
    jobId,
    { statusApproval: false },
    { new: true }
  );
  if (!jobPost) {
    throw new NotFoundError("Job post not found");
  }
  return {
    status: "OK",
    message: "Job post rejected successfully",
    data: jobPost,
  };
};

module.exports = {
  getNumberOfNewUsers,
  getNumberOfNewJobPosts,
  getJobApplicationCount,
  getJobPostViewCount,
  approveJobPost,
  rejectJobPost,
};
