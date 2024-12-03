const JobPost = require("../models/JobPostModel");
const JobCompanyInfo = require("../models/JobCompanyInfoModel");
const JobInfo = require("../models/JobInfoModel");
const CandidateExpectations = require("../models/CandidateExpectationsModel");
const SaveJob = require("../models/SaveJobModel");
const createJobPost = (recruiterId, newJobPost) => {
  return new Promise(async (resolve, reject) => {
    const { formData } = newJobPost;
    const {
      jobTitle,
      jobLocation,
      location,
      jobDescription,
      jobRequirements,
      jobType,
      minSalary,
      maxSalary,
      canDeal,
      expirationDate,
      jobInformation,
      companyInfo,
    } = formData;
    const {
      jobLevel,
      jobIndustry,
      keywords,
      jobField,
      language,
      minExperience,
      nationality,
      educationLevel,
      gender,
      maritalStatus,
      minAge,
      maxAge,
    } = jobInformation;
    const {
      companyName,
      companyAddress,
      companySize,
      companyBenefits,
      companyLogo,
      companyStaffName,
      companyEmail,
    } = companyInfo;
    const arrBenefits = Object.values(companyBenefits);
    const arrLocations = Object.values(location);
    const newArray = arrLocations.map((item) => item?.title);

    try {
      const jobCompanyInfo = await JobCompanyInfo.create({
        companyName,
        companyAddress,
        companySize,
        companyBenefits: arrBenefits,
        companyLogo,
        companyStaffName,
        companyEmail,
      });
      const jobInfo = await JobInfo.create({
        jobTitle,
        jobDescription,
        jobRequirements,
        jobType,
        minSalary,
        maxSalary,
        canDeal,
        jobLevel,
        jobIndustry,
        location: newArray,
      });
      const candidateExpectations = await CandidateExpectations.create({
        keywords,
        jobField,
        language,
        minExperience,
        nationality,
        educationLevel,
        gender,
        maritalStatus,
        minAge,
        maxAge,
      });
      const createdJobPost = await JobPost.create({
        jobCompanyInfoId: jobCompanyInfo._id,
        candidateExpectationsId: candidateExpectations._id,
        jobInfoId: jobInfo._id,
        recruiterId: recruiterId,
        expirationDate,
        postViews: 0,
        statusSeeking: true,
        datePosted: new Date(),
      });
      if (createdJobPost) {
        resolve({
          status: "OK",
          message: "success",
          data: createdJobPost,
        });
      }
    } catch (e) {
      // console.log(e)
      reject(e);
    }
  });
};

const updateJobPost = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { formData } = data;
      const jobPost = await JobPost.findById({
        _id: id,
      });
      if (jobPost === null) {
        resolve({
          status: "ERR",
          message: "The JobPost is not defined",
        });
      }
      const { companyInfo } = formData;
      const {
        companyName,
        companyAddress,
        companySize,
        companyBenefits,
        companyLogo,
        companyStaffName,
        companyEmail,
      } = companyInfo;
      const arrBenefits = Object.values(companyBenefits);
      let arrayBenefit = [];
      const newArrayBenefit = arrBenefits.map((item, index) => {
        if (item !== null) {
          arrayBenefit.push(item);
        }
      });
      const jobCompanyInfo = await JobCompanyInfo.findByIdAndUpdate(
        jobPost.jobCompanyInfoId,
        {
          companyName,
          companyAddress,
          companySize,
          companyBenefits: arrayBenefit,
          companyLogo,
          companyStaffName,
          companyEmail,
        },
        { new: true }
      );
      const { jobInformation } = formData;
      const { jobLevel, jobIndustry } = jobInformation;
      const {
        jobTitle,
        location,
        jobDescription,
        jobRequirements,
        jobType,
        minSalary,
        maxSalary,
        canDeal,
      } = formData;
      const arrLocations = Object.values(location);
      let arrLocation = [];
      const newArrayLocation = arrLocations.map((item) => {
        if (item !== null) {
          if (item.title) {
            arrLocation.push(item.title);
          } else {
            arrLocation.push(item);
          }
        }
      });
      const jobInfo = await JobInfo.findByIdAndUpdate(
        jobPost.jobInfoId,
        {
          jobTitle,
          jobDescription,
          jobRequirements,
          jobType,
          minSalary,
          maxSalary,
          canDeal,
          jobLevel,
          jobIndustry,
          location: arrLocation,
        },
        { new: true }
      );
      const candidateExpectations =
        await CandidateExpectations.findByIdAndUpdate(
          jobPost.candidateExpectationsId,
          formData.jobInformation,
          { new: true }
        );
      const jobPostUpdate = await JobPost.findByIdAndUpdate(
        {
          _id: id,
        },
        formData,
        { $set: { status: true } },
        { new: true }
      );
      resolve({
        status: "OK",
        message: "SUCESSS",
        data: jobPostUpdate,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteJobPost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkJobPost = await JobPost.findOne({
        _id: id,
      });

      if (checkJobPost === null) {
        resolve({
          status: "OK",
          message: "The JobPost is not defined",
        });
      }
      // const save = await SaveJob.find({ jobPostId: id })
      await JobCompanyInfo.findByIdAndDelete(checkJobPost.jobCompanyInfoId);
      await JobInfo.findByIdAndDelete(checkJobPost.jobInfoId);
      await CandidateExpectations.findByIdAndDelete(
        checkJobPost.candidateExpectationsId
      );
      await JobPost.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete jobpost success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllJobPost = (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();

      let dateFilter = {};
      if (filter.days) {
        const daysAgo = new Date(today);
        daysAgo.setDate(today.getDate() - parseInt(filter.days, 10));
        dateFilter = { datePosted: { $gte: daysAgo } };
      }
      const jobPosts = await JobPost.find();

      for (const job of jobPosts) {
        if (job.expirationDate < today) {
          await JobPost.findByIdAndUpdate(job._id, { statusSeeking: false }, { new: true });
        }
      }
      const jobPost = await JobPost.find({
        ...dateFilter,
        expirationDate: { $gt: today },
        statusSeeking: true,
      }).sort({ datePosted: -1 });
      const results = await Promise.all(
        jobPost.map(async (job) => {
          const jobCompanyInfo = await JobCompanyInfo.findById(
            job.jobCompanyInfoId
          );

          const candidateExpectations = await CandidateExpectations.findById(
            job.candidateExpectationsId
          );
          const jobInfo = await JobInfo.findById(job.jobInfoId);
          const {
            companyName,
            companyAddress,
            companySize,
            companyBenefits,
            companyLogo,
            companyStaffName,
            companyEmail,
          } = jobCompanyInfo;
          const {
            jobTitle,
            jobLocation,
            jobDescription,
            jobRequirements,
            jobType,
            location,

            minSalary,
            maxSalary,
            canDeal,
            jobLevel,
            jobIndustry,
          } = jobInfo;
          const {
            keywords,
            jobField,
            language,
            minExperience,
            nationality,
            educationLevel,
            gender,
            maritalStatus,
            minAge,
            maxAge,
          } = candidateExpectations;
          const {
            _id,
            recruiterId,
            expirationDate,
            statusSeeking,
            postViews,
            createdAt,
          } = job;

          return {
            _id,
            recruiterId,
            expirationDate,
            statusSeeking,
            postViews,
            createdAt,
            companyName,
            companyAddress,
            companySize,
            companyBenefits,
            companyLogo,
            companyStaffName,
            companyEmail,
            keywords,
            jobField,
            language,
            minExperience,
            nationality,
            educationLevel,
            gender,
            maritalStatus,
            minAge,
            maxAge,
            jobTitle,
            jobLocation,
            jobDescription,
            jobRequirements,
            jobType,
            location,
            minSalary,
            maxSalary,
            canDeal,
            jobLevel,
            jobIndustry,
          };
        })
      );

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: results,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllJobPostAdmin = (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();

      let dateFilter = {};
      if (filter.days) {
        const daysAgo = new Date(today);
        daysAgo.setDate(today.getDate() - filter.days);
        dateFilter = { createdAt: { $gte: daysAgo } };
      }

      const jobPost = await JobPost.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });

      const results = await Promise.all(
        jobPost.map(async (job) => {
          const jobCompanyInfo = await JobCompanyInfo.findById(
            job.jobCompanyInfoId
          );
          const candidateExpectations = await CandidateExpectations.findById(
            job.candidateExpectationsId
          );
          const jobInfo = await JobInfo.findById(job.jobInfoId);

          const {
            companyName,
            companyAddress,
            companySize,
            companyBenefits,
            companyLogo,
            companyStaffName,
            companyEmail,
          } = jobCompanyInfo;
          const {
            jobTitle,
            jobLocation,
            jobDescription,
            jobRequirements,
            jobType,
            location,
            minSalary,
            maxSalary,
            canDeal,
            jobLevel,
            jobIndustry,
          } = jobInfo;
          const {
            keywords,
            jobField,
            language,
            minExperience,
            nationality,
            educationLevel,
            gender,
            maritalStatus,
            minAge,
            maxAge,
          } = candidateExpectations;
          const {
            _id,
            recruiterId,
            expirationDate,
            statusSeeking,
            statusApproval,
            postViews,
            createdAt,
          } = job;

          return {
            _id,
            recruiterId,
            expirationDate,
            statusSeeking,
            statusApproval,
            postViews,
            createdAt,
            companyName,
            companyAddress,
            companySize,
            companyBenefits,
            companyLogo,
            companyStaffName,
            companyEmail,
            keywords,
            jobField,
            language,
            minExperience,
            nationality,
            educationLevel,
            gender,
            maritalStatus,
            minAge,
            maxAge,
            jobTitle,
            jobLocation,
            jobDescription,
            jobRequirements,
            jobType,
            location,
            minSalary,
            maxSalary,
            canDeal,
            jobLevel,
            jobIndustry,
          };
        })
      );

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: results,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getMyJobPost = async (id) => {
  try {
    const jobPost = await JobPost.find({ recruiterId: id }).sort({
      createdAt: -1,
      updatedAt: -1,
    });

    if (!jobPost || !jobPost.length) {
      return {
        status: "ERR",
        message: "No job posts found for this recruiter.",
      };
    }

    const results = await Promise.all(
      jobPost.map(async (job) => {
        const jobCompanyInfo = await JobCompanyInfo.findById(
          job.jobCompanyInfoId
        );
        const candidateExpectations = await CandidateExpectations.findById(
          job.candidateExpectationsId
        );
        const jobInfo = await JobInfo.findById(job.jobInfoId);
        const {
          companyName,
          companyAddress,
          companySize,
          companyBenefits,
          companyLogo,
          companyStaffName,
          companyEmail,
        } = jobCompanyInfo;
        const {
          jobTitle,
          location,
          jobDescription,
          jobRequirements,
          jobType,
          minSalary,
          maxSalary,
          canDeal,
          jobLevel,
          jobIndustry,
        } = jobInfo;
        const {
          keywords,
          jobField,
          language,
          minExperience,
          nationality,
          educationLevel,
          gender,
          maritalStatus,
          minAge,
          maxAge,
        } = candidateExpectations;
        const {
          _id,
          recruiterId,
          jobCompanyInfoId,
          candidateExpectationsId,
          jobInfoId,
          expirationDate,
          statusSeeking,
          statusApproval,
          postViews,
          datePosted,
        } = job;

        return {
          _id,
          recruiterId,
          jobCompanyInfoId,
          candidateExpectationsId,
          jobInfoId,
          expirationDate,
          statusSeeking,
          statusApproval,
          postViews,
          datePosted,
          companyName,
          companyAddress,
          companySize,
          companyBenefits,
          companyLogo,
          companyStaffName,
          companyEmail,
          keywords,
          jobField,
          language,
          minExperience,
          nationality,
          educationLevel,
          gender,
          maritalStatus,
          minAge,
          maxAge,
          jobTitle,
          location,
          jobDescription,
          jobRequirements,
          jobType,
          minSalary,
          maxSalary,
          canDeal,
          jobLevel,
          jobIndustry,
        };
      })
    );
    return {
      status: "OK",
      message: "SUCCESS",
      data: results,
    };
  } catch (error) {
    console.error("Error fetching job posts:", error);
    // Consider re-throwing or returning a specific error object here
  }
};

const getDetailsJobPost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobPost = await JobPost.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $inc: {
            postViews: +1,
          },
        }
      );
      if (jobPost === null) {
        resolve({
          status: "ERR",
          message: "The jobPost is not defined",
        });
      }

      const jobCompanyInfo = await JobCompanyInfo.findById(
        jobPost.jobCompanyInfoId
      );
      const candidateExpectations = await CandidateExpectations.findById(
        jobPost.candidateExpectationsId
      );

      const jobInfo = await JobInfo.findById(jobPost.jobInfoId);
      const {
        companyName,
        companyAddress,
        companySize,
        companyBenefits,
        companyLogo,
        companyStaffName,
        companyEmail,
      } = jobCompanyInfo;
      const {
        jobTitle,
        location,
        jobDescription,
        jobRequirements,
        jobType,
        minSalary,
        maxSalary,
        canDeal,
        jobLevel,
        jobIndustry,
      } = jobInfo;
      const {
        keywords,
        jobField,
        language,
        minExperience,
        nationality,
        educationLevel,
        gender,
        maritalStatus,
        minAge,
        maxAge,
      } = candidateExpectations;
      const {
        _id,
        recruiterId,
        jobCompanyInfoId,
        candidateExpectationsId,
        jobInfoId,
        expirationDate,
        statusSeeking,
        statusApproval,
        postViews,
        datePosted,
        numberOfPositions,
      } = jobPost;
      const results = {
        _id,
        recruiterId,
        jobCompanyInfoId,
        candidateExpectationsId,
        jobInfoId,
        expirationDate,
        statusSeeking,
        statusApproval,
        postViews,
        numberOfPositions,
        datePosted,
        companyName,
        companyAddress,
        companySize,
        companyBenefits,
        companyLogo,
        companyStaffName,
        companyEmail,
        keywords,
        jobField,
        language,
        minExperience,
        nationality,
        educationLevel,
        gender,
        maritalStatus,
        minAge,
        maxAge,
        jobTitle,
        location,
        jobDescription,
        jobRequirements,
        jobType,
        minSalary,
        maxSalary,
        canDeal,
        jobLevel,
        jobIndustry,
      };
      resolve({
        status: "OK",
        message: "SUCESSS",
        data: results,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelJobPost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobPost = await JobPost.findByIdAndUpdate(
        {
          _id: id,
        },
        { $set: { statusSeeking: false } },
        { new: true }
      );

      if (jobPost === null) {
        resolve({
          status: "ERR",
          message: "The jobPost is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: jobPost,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyJobPost = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await JobPost.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const approvalJobpost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobPost = await JobPost.findByIdAndUpdate(
        {
          _id: id,
        },
        { $set: { statusApproval: true } },
        { new: true }
      );

      if (jobPost === null) {
        resolve({
          status: "ERR",
          message: "The jobPost is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: jobPost,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const rejectJobpost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jobPost = await JobPost.findByIdAndUpdate(
        {
          _id: id,
        },
        { $set: { statusApproval: false } },
        { new: true }
      );

      if (jobPost === null) {
        resolve({
          status: "ERR",
          message: "The jobPost is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: jobPost,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createJobPost,
  updateJobPost,
  deleteJobPost,
  getAllJobPost,
  getMyJobPost,
  getDetailsJobPost,
  cancelJobPost,
  deleteManyJobPost,
  getAllJobPostAdmin,
  approvalJobpost,
  rejectJobpost,
};
