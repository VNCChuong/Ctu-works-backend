const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  // info company
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" },
  jobCompanyInfoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobCompanyInfo",
    required: true,
  },
  candidateExpectationsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "candidateExpectations",
    required: true,
  },
  jobInfoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobInfo",
    required: true,
  },
  expirationDate: {
    type: Date,
  },
  numberOfPositions: Number,
  statusSeeking: {
    type: Boolean,
  },
  statusApproval: {
    type: Boolean,
    default: false,
  },
  postViews: {
    type: Number,
  },
  datePosted: {
    type: Date,
  },
});

const jobPost = mongoose.model("jobPost", jobPostSchema);

module.exports = jobPost;
