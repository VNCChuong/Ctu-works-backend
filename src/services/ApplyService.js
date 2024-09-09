const Apply = require("../models/ApplyModel")

const createApply = (newApply) => {
    return new Promise(async (resolve, reject) => {

        const { userId, jobPostId, recruiterId } = newApply
        try {
            const createdApply = await Apply.create({
                userId: userId,
                jobPostId: jobPostId,
                recruiterId: recruiterId
            })
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



const getMyApply = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const apply = await Apply.find({
                userId: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            const applyRecruiter = await Apply.find({
                recruiterId: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (apply === null && applyRecruiter === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Apply is not defined'
                })
            }
            if (apply === null) {
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