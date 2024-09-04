const SaveJob = require("../models/SaveJobModel")

const createSaveJob = (newSaveJob) => {
    return new Promise(async (resolve, reject) => {

        const { userId, jobPostId } = newSaveJob
        try {
            const createdSaveJob = await SaveJob.create({
                userId: userId,
                jobPostId: jobPostId
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



module.exports = {
    createSaveJob,
    deleteSaveJob,
    getMySaveJob,
}