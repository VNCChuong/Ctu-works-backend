const JobInfoService = require("../services/JobInfoService");
const createJobInfo = async (req, res) => {
    try {
      const {
        jobTitle,
        location,
        jobDescription,
        jobRequirements,
        jobType,
        minSalary,
        maxSalary,
        datePosted,
        jobLevel,
        jobIndustry,
      } = req.body;
      if (
        !jobTitle ||
        !location ||
        !jobDescription ||
        !jobRequirements ||
        !jobType ||
        !minSalary ||
        !maxSalary ||
        !datePosted ||
        !jobLevel ||
        !jobIndustry
      ) {
        return res.status(200).json({
          status: "ERR",
          message: "The input is required",
        });
      }
      const response = await JobInfoService.createJobInfo(req.body);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  };
  const updateJobInfo = async (req, res) => {
    try {
      const { id, data } = req.body;
      if (!id || !data) {
        return res.status(200).json({
          status: "ERR",
          message: "The input is required",
        });
      }
      const response = await JobInfoService.updateJobInfo(req.body);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  };
  
  const deleteJobInfo = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(200).json({
          status: "ERR",
          message: "The id is required",
        });
      }
      const response = await JobInfoService.deleteJobInfo(id);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  };
  
  const getJobInfo = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(200).json({
          status: "ERR",
          message: "The id is required",
        });
      }
      const response = await JobInfoService.getJobInfo(id);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  };
  const getRelatedJobs = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          status: "ERR",
          message: "The id is required",
        });
      }
  
      const response = await JobInfoService.getRelatedJobs(id);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
  
  module.exports = {
    createJobInfo,
    updateJobInfo,
    deleteJobInfo,
    getJobInfo,
    getRelatedJobs,
  };