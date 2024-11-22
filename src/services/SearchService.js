const JobPost = require("../models/JobPostModel");
const JobInfo = require("../models/JobInfoModel");
const Company = require("../models/CompanyModel");

const searchJobs = async (filters) => {
  try {
    const { keyword, jobLevel, location, companyName, jobType } = filters;
    const regex = new RegExp(keyword, "i");

    const matchingJobInfos = await JobInfo.find({
      $and: [
        {
          $or: [
            { jobTitle: regex },
            { jobDescription: regex },
            { jobRequirements: regex },
          ],
        },
        jobLevel ? { jobLevel: jobLevel } : {},
        jobType ? { jobType: jobType } : {},
        location ? { location: { $regex: new RegExp(location, "i") } } : {},
      ],
    });

    const matchingJobInfoIds = matchingJobInfos.map((info) => info._id);

    const matchingCompanies = await Company.find({
      companyName: new RegExp(companyName, "i"),
    });

    const matchingCompanyIds = matchingCompanies.map((company) => company._id);

    const jobs = await JobPost.find({
      $and: [
        { jobInfoId: { $in: matchingJobInfoIds } },
        companyName ? { recruiterId: { $in: matchingCompanyIds } } : {},
      ],
    }).populate("jobInfoId");

    const jobsWithId = jobs.map((job) => ({
      jobPostId: job._id,
      ...job._doc,
    }));

    return {
      status: "OK",
      message: "Jobs retrieved successfully",
      data: jobsWithId,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

module.exports = {
  searchJobs,
};
