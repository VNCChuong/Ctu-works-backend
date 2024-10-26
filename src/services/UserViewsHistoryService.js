const UserViewsHistory = require("../models/UserViewsHistoryModel")
const { getDetailsRecruiter } = require("../services/RecruiterService")
const { getDetailsUser } = require("../services/UserService")
const create = (newCreate) => {
    return new Promise(async (resolve, reject) => {

        const { userId, recruiterId } = newCreate
        try {
            const check = await UserViewsHistory.findOne({
                userId: userId,
                recruiterId: recruiterId
            })
            if (check === null) {
                const create = await UserViewsHistory.create({
                    userId: userId,
                    recruiterId: recruiterId,
                })
                if (create) {
                    resolve({
                        status: 'OK',
                        message: 'success',
                        data: create,
                    })
                }
            } else {
                check.updateOne({ viewDate: new Date() })

                resolve({
                    status: 'OK',
                    message: 'Update success',
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}


const get = async (id) => {
    try {
        const historyViewsRecruiter = await UserViewsHistory.find({
            recruiterId: id
        }).sort({ createdAt: -1, updatedAt: -1 })
        const historyViewsUser = await UserViewsHistory.find({
            userId: id
        }).sort({ createdAt: -1, updatedAt: -1 })
        if (!historyViewsRecruiter && !historyViewsUser) {
            return {
                status: 'ERR',
                message: 'The history is not defined'
            }
        }
        if (historyViewsRecruiter.length > 0) {
            const data = await Promise.all(historyViewsRecruiter.map(async (item) => {
                try {
                    const userDetails = await getDetailsUser(item.userId.toString())
                    return userDetails.data
                } catch (e) {
                    console.error(`Error getting job details for ${item.jobPostId}:`, e)
                    return null
                }
            }))
            return {
                status: 'OK',
                message: 'SUCCESS',
                data: data
            }
        } else {
            const data = await Promise.all(historyViewsUser.map(async (item) => {
                try {
                    const recruiterDetails = await getDetailsRecruiter(item.recruiterId.toString())
                    return recruiterDetails.data
                } catch (e) {
                    console.error(`Error getting job details for ${item.jobPostId}:`, e)
                    return null
                }
            }))

            return {
                status: 'OK',
                message: 'SUCCESS',
                data: data
            }
        }

    } catch (e) {
        console.error('Error getting profile views:', e)
        return {
            status: 'ERR',
            message: 'Error getting profile views'
        }
    }
}


module.exports = {
    create,
    get,
}