const JobCompanyInfo = require('../models/JobCompanyInfoModel')

const createJobCompanyInfo = (newJobCompanyInfo) => {
    return new Promise(async (resolve, reject) => {

        const { _id, jobPostId, recruiterId, workingPreferences, MSSV, email, fullName, jobTitle,
            currentDegree, currentIndustries, currentJobFunction, yearsExperience, currentSalary,
            highestDegree, country, phoneNumber, dateOfBirth, city, district, address, gender, maritalStatusId,
        } = newJobCompanyInfo
        try {
            const createdApply = await JobCompanyInfo.create({
                newJobCompanyInfo
            })
            if (true) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createdApply,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateJobCompanyInfo = (newJobCompanyInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, data } = newJobCompanyInfo
            const jobCompanyInfo = await JobCompanyInfo.findById({
                _id: id
            })
            if (jobCompanyInfo === null) {
                resolve({
                    status: 'ERR',
                    message: 'The jobCompanyInfo is not defined'
                })
            }
            const updateJobCompanyInfo = await JobCompanyInfo.findByIdAndUpdate(
                id,
                data,
                { new: true }
            )
            if (updateJobCompanyInfo) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: updateJobCompanyInfo,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteJobCompanyInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await JobCompanyInfo.findById({
                _id: id
            })
            if (check === null) {
                resolve({
                    status: 'OK',
                    message: 'The data is not defined'
                })
            }
            await JobCompanyInfo.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getJobCompanyInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobCompanyInfo = await JobCompanyInfo.find({
                _id: id
            })
            console.log(jobCompanyInfo)
            if (jobCompanyInfo === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Apply is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: jobCompanyInfo
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createJobCompanyInfo,
    updateJobCompanyInfo,
    deleteJobCompanyInfo,
    getJobCompanyInfo,
}