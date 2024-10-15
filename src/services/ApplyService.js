const Apply = require("../models/ApplyModel");
const JobPost = require("../models/JobPostModel");
const UserInfo = require("../models/UserInfoModel");
const WorkingPreferences = require("../models/WorkingPreferencesModel");
const JobCompanyInfo = require("../models/JobCompanyInfoModel");
const jobInfo = require("../models/JobInfoModel");
const JobInfo = require("../models/JobInfoModel");
const Company = require("../models/CompanyModel");
const createApply = (newApply) => {
  return new Promise(async (resolve, reject) => {
    const {
      _id,
      jobPostId,
      recruiterId,
      MSSV,
      fullName,
      jobTitle,
      email,
      workingPreferences,
      currentDegree,
      currentIndustries,
      currentJobFunction,
      yearsExperience,
      currentSalary,
      highestDegree,
      country,
      phoneNumber,
      dateOfBirth,
      city,
      district,
      address,
      gender,
      maritalStatusId,
    } = newApply;

    try {
      const checkApply = await Apply.findOne({
        jobPostId: jobPostId,
        userId: _id,
      });
      if (checkApply !== null) {
        resolve({
          status: "ERR",
          message: "The user has already applied for this job",
        });
        return;
      }
      const jobpost = await JobPost.findById(jobPostId);
      if (jobpost === null) {
        resolve({
          status: "ERR",
          message: "Job post not found",
        });
        return;
      }
      const {
        companyIndustries,
        locations,
        benefits,
        salary,
        desiredJobLevel,
        jobFunction,
      } = workingPreferences;
      const workingPreferencesData = await WorkingPreferences.create({
        companyIndustries,
        locations,
        benefits,
        salary,
        desiredJobLevel,
        jobFunction,
      });

      const userInfoData = await UserInfo.create({
        MSSV,
        fullName,
        jobTitle,
        currentDegree,
        currentIndustries,
        currentJobFunction,
        yearsExperience,
        currentSalary,
        highestDegree,
        country,
        phoneNumber,
        dateOfBirth,
        city,
        district,
        address,
        gender,
        maritalStatusId,
      });
      const createdApply = await Apply.create({
        userId: _id,
        jobPostId: jobPostId,
        recruiterId: recruiterId,
        userInfoId: userInfoData._id,
        workingPreferencesId: workingPreferencesData._id,
      });

      if (createdApply) {
        resolve({
          status: "OK",
          message: "create apply success",
          data: createdApply,
        });
      }
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
};

const updateApply = (newApply) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, status } = newApply;
      const apply = await Apply.findById({
        _id: id,
      });
      if (apply === null) {
        resolve({
          status: "ERR",
          message: "The apply is not defined",
        });
      }
      const createdApply = await Apply.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          status: status,
        },
        { new: true }
      );
      if (createdApply) {
        resolve({
          status: "OK",
          message: "success",
          data: createdApply,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteApply = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkApply = await Apply.findById({
        _id: id,
      });
      if (checkApply === null) {
        resolve({
          status: "OK",
          message: "The Apply is not defined",
        });
      }
      await Apply.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Apply success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getMyApply = (id, jobpostId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const apply = await Apply.find({
        userId: id,
      });
      const applyRecruiter = await Apply.find({
        recruiterId: id,
        jobPostId: jobpostId,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (apply === null && applyRecruiter === null) {
        resolve({
          status: "ERR",
          message: "The Apply is not defined",
        });
      }
      if (apply.length > 0) {
        //     const jobPost = await JobPost.findById(apply[0].jobPostId)
        //     const jobInfo = await JobInfo.findById(jobPost.jobInfoId)
        //     const companyInfo = await JobCompanyInfo.findById(jobPost.jobCompanyInfoId)
        //     const userInfo = await UserInfo.findById(apply[0].userInfoId)
        //     const workingPreferences = await WorkingPreferences.findById(apply[0].workingPreferencesId)
        //     const { jobTitle, location, minSalary, maxSalary } = jobInfo
        //     const { companyName, companyLogo } = companyInfo
        //     const { MSSV,
        //         fullName,
        //         jobTitleUser,
        //         currentDegree,
        //         currentIndustries,
        //         currentJobFunction,
        //         yearsExperience,
        //         currentSalary,
        //         highestDegree,
        //         country,
        //         phoneNumber,
        //         dateOfBirth,
        //         address,
        //         gender,
        //         maritalStatusId, } = userInfo
        //     const applyData = {
        //         ...apply[0],
        //         jobTitle, location, minSalary, maxSalary, companyName, companyLogo, MSSV,
        //         fullName,
        //         jobTitleUser,
        //         currentDegree,
        //         currentIndustries,
        //         currentJobFunction,
        //         yearsExperience,
        //         currentSalary,
        //         highestDegree,
        //         country,
        //         phoneNumber,
        //         dateOfBirth,
        //         address,
        //         gender,
        //         maritalStatusId, workingPreferences
        //     }
        //     console.log(applyData)
        resolve({
          status: "OK",
          message: "SUCESSS",
          data: apply,
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCESSS",
          data: applyRecruiter,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createApply,
  updateApply,
  deleteApply,
  getMyApply,
};
