const Apply = require("../models/ApplyModel");
const JobPost = require("../models/JobPostModel");
const UserInfo = require("../models/UserInfoModel");
const WorkingPreferences = require("../models/WorkingPreferencesModel");
const JobCompanyInfo = require("../models/JobCompanyInfoModel");
const jobInfo = require("../models/JobInfoModel");
const JobInfo = require("../models/JobInfoModel");
const Company = require("../models/CompanyModel");
const Notification = require("../models/NotificationModel");

// const createApply = (newApply) => {
//   return new Promise(async (resolve, reject) => {
//     const {
//       _id,
//       jobPostId,
//       recruiterId,
//       MSSV,
//       fullName,
//       jobTitle,
//       email,
//       workingPreferences,
//       currentDegree,
//       currentIndustries,
//       currentJobFunction,
//       yearsExperience,
//       currentSalary,
//       highestDegree,
//       country,
//       phoneNumber,
//       dateOfBirth,
//       city,
//       district,
//       address,
//       gender,
//       maritalStatusId,
//     } = newApply;

//     try {
//       const checkApply = await Apply.findOne({
//         jobPostId: jobPostId,
//         userId: _id,
//       });
//       if (checkApply !== null) {
//         resolve({
//           status: "ERR",
//           message: "The user has already applied for this job",
//         });
//         return;
//       }
//       const jobpost = await JobPost.findById(jobPostId);
//       if (jobpost === null) {
//         resolve({
//           status: "ERR",
//           message: "Job post not found",
//         });
//         return;
//       }
//       const {
//         companyIndustries,
//         locations,
//         benefits,
//         salary,
//         desiredJobLevel,
//         jobFunction,
//       } = workingPreferences;
//       const workingPreferencesData = await WorkingPreferences.create({
//         companyIndustries,
//         locations,
//         benefits,
//         salary,
//         desiredJobLevel,
//         jobFunction,
//       });

//       const userInfoData = await UserInfo.create({
//         MSSV,
//         fullName,
//         jobTitle,
//         currentDegree,
//         currentIndustries,
//         currentJobFunction,
//         yearsExperience,
//         currentSalary,
//         highestDegree,
//         country,
//         phoneNumber,
//         dateOfBirth,
//         city,
//         district,
//         address,
//         gender,
//         maritalStatusId,
//       });
//       const createdApply = await Apply.create({
//         userId: _id,
//         jobPostId: jobPostId,
//         recruiterId: recruiterId,
//         userInfoId: userInfoData._id,
//         workingPreferencesId: workingPreferencesData._id,
//       });

//       if (createdApply) {
//         resolve({
//           status: "OK",
//           message: "create apply success",
//           data: createdApply,
//         });
//       }
//     } catch (e) {
//       reject(e);
//       console.log(e);
//     }
//   });
// };

const createApply = (newApply, io) => {
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
      // Kiểm tra xem user đã apply cho job này chưa
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

      const jobpost = await JobPost.findById(jobPostId).populate("jobInfoId");
      if (jobpost === null) {
        resolve({
          status: "ERR",
          message: "Job post not found",
        });
        return;
      }

      // Tạo thông tin về workingPreferences và userInfo
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

      // Tạo thông báo cho nhà tuyển dụng
      const notification = new Notification({
        UserId: recruiterId,
        message: `${fullName} đã nộp đơn ứng tuyển cho công việc ${jobpost.jobInfoId?.jobTitle}.`,
        isRead: false,
      });

      await notification.save();

      // Gửi thông báo thời gian thực cho nhà tuyển dụng
      io.emit(`notification-${recruiterId}`, notification);

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

const getApplyCountByJob = (jobPostId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const applyCount = await Apply.countDocuments({ jobPostId: jobPostId });

      resolve({
        status: "OK",
        message: "Success",
        data: { applyCount },
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: "Failed to get apply count",
        error: error.message,
      });
    }
  });
};

module.exports = {
  createApply,
  updateApply,
  deleteApply,
  getMyApply,
  getApplyCountByJob,
};