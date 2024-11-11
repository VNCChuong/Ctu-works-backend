const SendInvite = require("../models/SendInviteModel")

const createSendInvite = (newSendInvite) => {
    return new Promise(async (resolve, reject) => {
        const { userId, recruiterId, jobPostId } = newSendInvite
        try {
            const create = await SendInvite.create({
                jobPostId: jobPostId,
                userId: userId,
                recruiterId: recruiterId
            })
            if (create) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: create,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteSendInvite = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkSendInvite = await SendInvite.findOne({
                _id: id
            })
            if (checkSendInvite === null) {
                resolve({
                    status: 'OK',
                    message: 'The send invite is not defined'
                })
            }
            await SendInvite.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete send invite success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getMySendInvite = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sendInvite = await SendInvite.find({
                recruiterId: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (sendInvite === null) {
                resolve({
                    status: 'ERR',
                    message: 'The send invite is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: sendInvite
            })
        } catch (e) {
            reject(e)
        }
    })
}


const cancelSendInvite = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sendInvite = await SendInvite.findByIdAndUpdate(id, { status: "Đã hủy" })
            if (sendInvite === null) {
                resolve({
                    status: 'ERR',
                    message: 'The send invite is not defind'
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: sendInvite
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSendInvite,
    deleteSendInvite,
    getMySendInvite,
    cancelSendInvite
}