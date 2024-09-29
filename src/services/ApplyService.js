const Apply = require("../models/ApplyModel")
const JobPost = require("../models/JobPostModel")

const createApply = (newApply) => {
    return new Promise(async (resolve, reject) => {

        const { _id, jobPostId, recruiterId, workingPreferences, MSSV, email, fullName, jobTitle,
            currentDegree, currentIndustries, currentJobFunction, yearsExperience, currentSalary,
            highestDegree, country, phoneNumber, dateOfBirth, city, district, address, gender, maritalStatusId,
        } = newApply
        try {
            const checkApply = await Apply.findOne({
                jobPostId: jobPostId,
                userId: _id
            })
            if (checkApply !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The user has already applied for this job'
                })
                return
            }
            const jobpost = await JobPost.findById(jobPostId)
            const createdApply = await Apply.create({
                userId: _id,
                jobPostId: jobPostId,
                recruiterId: recruiterId,
                jobPostTitle: jobpost.jobTitle,
                companyLogo: jobpost.companyInfo.companyLogo,
                companyName: jobpost.companyInfo.companyName,
                jobLocation: jobpost.location,
                jobMinSalary: jobpost.minSalary,
                jobMaxSalary: jobpost.maxSalary,
                workingPreferences,
                MSSV,
                email,
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
            })
            if (true) {
                resolve({
                    status: 'OK',
                    message: 'create apply success',
                    data: createdApply,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateApply = (newApply) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, status } = newApply
            const apply = await Apply.findById({
                _id: id
            })
            if (apply === null) {
                resolve({
                    status: 'ERR',
                    message: 'The apply is not defined'
                })
            }
            const createdApply = await Apply.findByIdAndUpdate(
                {
                    _id: id
                },
                {
                    status: status,
                },
                { new: true }
            )
            if (createdApply) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: createdApply,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteApply = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkApply = await Apply.findById({
                _id: id
            })
            if (checkApply === null) {
                resolve({
                    status: 'OK',
                    message: 'The Apply is not defined'
                })
            }
            await Apply.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete Apply success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getMyApply = (id, jobpostId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const apply = await Apply.find({
                userId: id
            })
            const applyRecruiter = await Apply.find({
                recruiterId: id,
                jobPostId: jobpostId
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (apply === null && applyRecruiter === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Apply is not defined'
                })
            }
            if (apply.length > 0) {
                resolve({
                    status: 'OK',
                    message: 'SUCESSS',
                    data: apply
                })
            } else {
                resolve({
                    status: 'OK',
                    message: 'SUCESSS',
                    data: applyRecruiter
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createApply,
    updateApply,
    deleteApply,
    getMyApply,
}