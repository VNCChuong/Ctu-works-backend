const JobInfo = require("../models/JobInfoModel");

const createJobInfo = (newJobInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdJobInfo = await JobInfo.create(newJobInfo);
      resolve({
        status: "OK",
        message: "Success",
        data: createdJobInfo,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateJobInfo = (newJobInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, data } = newJobInfo;
      const jobInfo = await JobInfo.findById(id);
      if (jobInfo === null) {
        resolve({
          status: "ERR",
          message: "The data is not defined",
        });
        return;
      }
      const updatedJobInfo = await JobInfo.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: updatedJobInfo,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteJobInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await JobInfo.findById(id);
      if (check === null) {
        resolve({
          status: "OK",
          message: "The data is not defined",
        });
        return;
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
      const jobInfo = await JobInfo.findById(id);
      if (jobInfo === null) {
        resolve({
          status: "ERR",
          message: "The Apply is not defined",
        });
        return;
      }
      resolve({
        status: "OK",
        message: "Success",
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

const getJobIndustryCounts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobIndustryCounts = await JobInfo.aggregate([
        {
          $group: {
            _id: "$jobIndustry",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            jobIndustry: "$_id",
            count: 1,
          },
        },
      ]);

      resolve({
        status: "OK",
        message: "Job industry counts fetched successfully",
        data: jobIndustryCounts,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getJobsByIndustry = (jobIndustry) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobs = await JobInfo.find({ jobIndustry });
      if (jobs.length === 0) {
        resolve({
          status: "ERR",
          message: "No jobs found for the specified industry",
        });
        return;
      }
      resolve({
        status: "OK",
        message: "Jobs fetched successfully",
        data: jobs,
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
  getJobIndustryCounts,
  getJobsByIndustry,
};
