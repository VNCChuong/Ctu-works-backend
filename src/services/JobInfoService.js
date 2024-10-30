const JobInfo = require("../models/JobInfoModel");

const createJobInfo = (newJobInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdJobInfo = await JobInfo.create({
        newJobInfo,
      });
      if (true) {
        resolve({
          status: "OK",
          message: "Success",
          data: createdJobInfo,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateJobInfo = (newJobInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, data } = newJobInfo;
      const jobInfo = await JobInfo.findById({
        _id: id,
      });
      if (jobInfo === null) {
        resolve({
          status: "ERR",
          message: "The data is not defined",
        });
      }
      const updateJobInfo = await JobInfo.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (updateJobInfo) {
        resolve({
          status: "OK",
          message: "success",
          data: updateJobInfo,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteJobInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await JobInfo.findById({
        _id: id,
      });
      if (check === null) {
        resolve({
          status: "OK",
          message: "The data is not defined",
        });
      }
      await JobInfo.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getJobInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobInfo = await JobInfo.find({
        _id: id,
      });
      if (jobInfo === null) {
        resolve({
          status: "ERR",
          message: "The Apply is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESSS",
        data: jobInfo,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getRelatedJobs = (jobId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobInfo = await JobInfo.findById(jobId);
      if (!jobInfo) {
        resolve({
          status: "ERR",
          message: "Job not found",
        });
        return;
      }

      const { jobIndustry, jobLevel } = jobInfo;

      const relatedJobs = await JobInfo.find({
        _id: { $ne: jobId },
        $or: [{ jobIndustry: jobIndustry }, { jobLevel: jobLevel }],
      }).limit(5);

      resolve({
        status: "OK",
        message: "Related jobs fetched successfully",
        data: relatedJobs,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createJobInfo,
  updateJobInfo,
  deleteJobInfo,
  getJobInfo,
  getRelatedJobs,
};
