const SaveJob = require("../models/SaveJobModel")
const JobPost = require("../models/JobPostModel")
const JobCompanyInfo = require('../models/JobCompanyInfoModel')
const JobInfo = require('../models/JobInfoModel')
const CandidateExpectations = require('../models/CandidateExpectationsModel')
const createSaveJob = (newSaveJob) => {
    return new Promise(async (resolve, reject) => {
        const { userId, jobPostId } = newSaveJob
        try {
            const jobpost = await JobPost.findById(jobPostId)
            const { _id, recruiterId, jobCompanyInfoId, candidateExpectationsId,
                jobInfoId, expirationDate, statusSeeking, statusApproval, postViews, createdAt } = jobpost
            const jobCompanyInfo = await JobCompanyInfo.findById(jobCompanyInfoId)
            const candidateExpectations = await CandidateExpectations.findById(candidateExpectationsId)
            const jobInfo = await JobInfo.findById(jobInfoId)
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
            const createdSaveJob = await SaveJob.create({
                userId: userId,
                jobPostId: jobPostId,
                jobTitle: jobTitle,
                companyLogo: companyLogo || "https://images.vietnamworks.com/img/company-default-logo.svg",
                companyName: companyName,
                jobLocation: jobLocation,
                jobSalary: maxSalary,
            })
            if (createdSaveJob) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: createdSaveJob,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteSaveJob = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkSaveJob = await SaveJob.findOne({
                _id: id
            })
            if (checkSaveJob === null) {
                resolve({
                    status: 'OK',
                    message: 'The SaveJob is not defined'
                })
            }
            await SaveJob.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete SaveJob success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getMySaveJob = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const saveJob = await SaveJob.find({
                userId: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (saveJob === null) {
                resolve({
                    status: 'ERR',
                    message: 'The SaveJob is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: saveJob
            })
        } catch (e) {
            reject(e)
        }
    })
}


const checkSaveJob = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId, jobPostId } = data
            const saveJob = await SaveJob.findOne({
                userId: userId,
                jobPostId: jobPostId
            })
            if (saveJob === null) {
                resolve({
                    status: 'ERR',
                    message: 'The job is not save'
                })
            }
            resolve({
                status: 'OK',
                message: 'The job have been save by this user',
                data: saveJob
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSaveJob,
    deleteSaveJob,
    getMySaveJob,
    checkSaveJob
}