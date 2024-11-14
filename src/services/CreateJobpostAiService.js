const Apply = require("../models/ApplyModel")
const JobPost = require("../models/JobPostModel")
const UserInfo = require("../models/UserInfoModel")
const WorkingPreferences = require("../models/WorkingPreferencesModel")
const JobCompanyInfo = require("../models/JobCompanyInfoModel")
const jobInfo = require("../models/JobInfoModel")
const JobInfo = require("../models/JobInfoModel")
const Company = require("../models/CompanyModel")
const CreateJobpostAi = require("../models/CreateJobpostAiModel")
const createJob = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log(data)
        const { jobTitle, expirationDate, location,
            jobDescription, jobRequirements, jobType,
            minSalary, maxSalary, numberOfPositions,
            jobLevel, jobIndustry, keywords, jobField,
            language, minExperience, nationality, educationLevel,
            gender, minAge, maxAge, maritalStatus, companyName, companyAddress,
            companySize, companyLogo, companyStaffName, companyBenefits, companyEmail,
        } = data
        // console.log(jobTitle, expirationDate, location,
        //     jobDescription, jobRequirements, jobType,
        //     minSalary, maxSalary, numberOfPositions,
        //     jobLevel, jobIndustry, keywords, jobField,
        //     language, minExperience, nationality, educationLevel,
        //     gender, minAge, maxAge, maritalStatus, companyName, companyAddress,
        //     companySize, companyLogo, companyStaffName, companyBenefits, companyEmail,)
        try {

            const createJob = await CreateJobpostAi.create({
                jobTitle, expirationDate, location,
                jobDescription, jobRequirements, jobType,
                minSalary, maxSalary, numberOfPositions,
                jobLevel, jobIndustry, keywords, jobField,
                language, minExperience, nationality, educationLevel,
                gender, minAge, maxAge, maritalStatus, companyName, companyAddress,
                companySize, companyLogo, companyStaffName, companyBenefits, companyEmail,
            })

            if (createJob) {
                resolve({
                    status: 'OK',
                    message: 'create apply success',
                    data: createJob,
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}



const getDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const apply = await CreateJobpostAi.find({
                _id: id
            })
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: apply
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createJob,
    getDetails,
}