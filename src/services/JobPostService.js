const JobPost = require("../models/JobPostModel")
const JobCompanyInfo = require('../models/JobCompanyInfoModel')
const JobInfo = require('../models/JobInfoModel')
const CandidateExpectations = require('../models/CandidateExpectationsModel')
const SaveJob = require('../models/SaveJobModel')
const createJobPost = (recruiterId, newJobPost) => {
    return new Promise(async (resolve, reject) => {
        const { formData } = newJobPost
        const { jobTitle, jobLocation, jobDescription, jobRequirements, jobType, minSalary, maxSalary, expirationDate,
            jobInformation,
            companyInfo
        } = formData
        const {
            jobLevel, jobIndustry, keywords, jobField, language, minExperience,
            nationality, educationLevel, gender, maritalStatus, minAge, maxAge,
        } = jobInformation
        const { companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail } = companyInfo

        try {
            const jobCompanyInfo = await JobCompanyInfo.create({
                companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail
            })
            const jobInfo = await JobInfo.create({
                jobTitle, jobLocation, jobDescription,
                jobRequirements,
                jobType, minSalary,
                maxSalary, jobLevel, jobIndustry,
            })
            const candidateExpectations = await CandidateExpectations.create({
                keywords, jobField, language, minExperience, nationality, educationLevel, gender, maritalStatus, minAge, maxAge,
            })
            const createdJobPost = await JobPost.create({
                jobCompanyInfoId: jobCompanyInfo._id,
                candidateExpectationsId: candidateExpectations._id,
                jobInfoId: jobInfo._id,
                recruiterId: recruiterId,
                expirationDate,
                postViews: 0,
                statusSeeking: true,
                datePosted: new Date(),
            })
            if (createdJobPost) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: createdJobPost,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateJobPost = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobPost = await JobPost.findById({
                _id: id
            })

            if (jobPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The JobPost is not defined'
                })
            }
            const jobPostUpdate = await JobPost.findByIdAndUpdate(
                {
                    _id: id,
                }, data,
                { $set: { status: true } },
                { new: true }
            )
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: jobPostUpdate
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteJobPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkJobPost = await JobPost.findOne({
                _id: id
            })

            if (checkJobPost === null) {
                resolve({
                    status: 'OK',
                    message: 'The JobPost is not defined'
                })
            }
            // const save = await SaveJob.find({ jobPostId: id })
            await JobCompanyInfo.findByIdAndDelete(checkJobPost.jobCompanyInfoId)
            await JobInfo.findByIdAndDelete(checkJobPost.jobInfoId)
            await CandidateExpectations.findByIdAndDelete(checkJobPost.candidateExpectationsId)
            await JobPost.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete jobpost success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getAllJobPost = (filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const { jobTitle, location, ...otherFilters } = filter;
            const jobPost = await JobPost.find().sort({ createdAt: -1, updatedAt: -1 });
            const results = await Promise.all(jobPost.map(async (job) => {

                const jobCompanyInfo = await JobCompanyInfo.findById(job.jobCompanyInfoId)
                const candidateExpectations = await CandidateExpectations.findById(job.candidateExpectationsId)
                const jobInfo = await JobInfo.findById(job.jobInfoId)
                const {
                    companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail
                } = jobCompanyInfo
                const {
                    jobTitle, jobLocation, jobDescription,
                    jobRequirements,
                    jobType, minSalary,
                    maxSalary, jobLevel, jobIndustry,
                } = jobInfo
                const {
                    keywords, jobField, language, minExperience, nationality, educationLevel, gender,
                    maritalStatus, minAge, maxAge,
                } = candidateExpectations
                const { _id, recruiterId, jobCompanyInfoId, candidateExpectationsId,
                    jobInfoId, expirationDate, statusSeeking, statusApproval, postViews, createdAt } = job
                // Assuming job properties are objects
                return {
                    _id, recruiterId, jobCompanyInfoId, candidateExpectationsId,
                    jobInfoId, expirationDate, statusSeeking, statusApproval, postViews, createdAt,
                    companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail,
                    keywords, jobField, language, minExperience, nationality, educationLevel, gender,
                    maritalStatus, minAge, maxAge,
                    jobTitle, jobLocation, jobDescription,
                    jobRequirements,
                    jobType, minSalary,
                    maxSalary, jobLevel, jobIndustry,
                };
            }));

            // Create a filter object based on the provided filter
            // const filterObject = {
            //     $and: [
            //         jobTitle ? { jobTitle: { $regex: jobTitle, $options: 'i' } } : {},
            //         location ? { location: { $regex: location, $options: 'i' } } : {},
            //         // Add other filters as needed
            //         ...Object.entries(otherFilters).map(([key, value]) => ({ [key]: { $regex: value, $options: 'i' } }))
            //     ]
            // };

            // Find job posts based on the filter object and sort them
            // const totalJobPost = await JobPost.find(filterObject).sort({ createdAt: -1, updatedAt: -1 });
            // const totalJobPost = await JobPost.find({ "jobInformation.industry": "Kế Toán" })
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: results
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getMyJobPost = async (id) => {
    try {
        // Fetch jobPost and handle potential errors
        const jobPost = await JobPost.find({ recruiterId: id }).sort({ createdAt: -1, updatedAt: -1 });

        if (!jobPost || !jobPost.length) {
            return {
                status: 'ERR',
                message: 'No job posts found for this recruiter.'
            };
        }

        // Efficiently populate related data (consider using Promise.all)
        const results = await Promise.all(jobPost.map(async (job) => {

            const jobCompanyInfo = await JobCompanyInfo.findById(job.jobCompanyInfoId)
            const candidateExpectations = await CandidateExpectations.findById(job.candidateExpectationsId)
            const jobInfo = await JobInfo.findById(job.jobInfoId)
            const {
                companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail
            } = jobCompanyInfo
            const {
                jobTitle, jobLocation, jobDescription,
                jobRequirements,
                jobType, minSalary,
                maxSalary, jobLevel, jobIndustry,
            } = jobInfo
            const {
                keywords, jobField, language, minExperience, nationality, educationLevel, gender,
                maritalStatus, minAge, maxAge,
            } = candidateExpectations
            return {
                ...job,
                companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail,
                keywords, jobField, language, minExperience, nationality, educationLevel, gender,
                maritalStatus, minAge, maxAge,
                jobTitle, jobLocation, jobDescription,
                jobRequirements,
                jobType, minSalary,
                maxSalary, jobLevel, jobIndustry,
            };
        }));
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: results,
        };
    } catch (error) {
        console.error('Error fetching job posts:', error);
        // Consider re-throwing or returning a specific error object here
    }
};

const getDetailsJobPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobPost = await JobPost.findByIdAndUpdate(
                {
                    _id: id
                }, {
                $inc: {
                    postViews: + 1
                }
            }
            )
            if (jobPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The jobPost is not defined'
                })
            }

            const jobCompanyInfo = await JobCompanyInfo.findById(jobPost.jobCompanyInfoId)
            const candidateExpectations = await CandidateExpectations.findById(jobPost.candidateExpectationsId)
            const jobInfo = await JobInfo.findById(jobPost.jobInfoId)
            const {
                companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail
            } = jobCompanyInfo
            const {
                jobTitle, jobLocation, jobDescription,
                jobRequirements,
                jobType, minSalary,
                maxSalary, jobLevel, jobIndustry,
            } = jobInfo
            const {
                keywords, jobField, language, minExperience, nationality, educationLevel, gender,
                maritalStatus, minAge, maxAge,
            } = candidateExpectations
            const { _id, recruiterId, jobCompanyInfoId, candidateExpectationsId,
                jobInfoId, expirationDate, statusSeeking, statusApproval, postViews, datePosted } = jobPost
            const results = {
                _id, recruiterId, jobCompanyInfoId, candidateExpectationsId,
                jobInfoId, expirationDate, statusSeeking, statusApproval, postViews, datePosted,
                companyName, companyAddress, companySize, companyBenefits, companyLogo, companyStaffName, companyEmail,
                keywords, jobField, language, minExperience, nationality, educationLevel, gender,
                maritalStatus, minAge, maxAge,
                jobTitle, jobLocation, jobDescription,
                jobRequirements,
                jobType, minSalary,
                maxSalary, jobLevel, jobIndustry,
            };
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: results

            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelJobPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobPost = await JobPost.findByIdAndUpdate(
                {
                    _id: id,
                },
                { $set: { status: false } },
                { new: true }
            )

            if (jobPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The jobPost is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: jobPost
            })
        } catch (e) {
            reject(e)
        }
    })
}


const deleteManyJobPost = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await JobPost.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createJobPost,
    updateJobPost,
    deleteJobPost,
    getAllJobPost,
    getMyJobPost,
    getDetailsJobPost,
    cancelJobPost,
    deleteManyJobPost,
}