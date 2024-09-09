const ProfileViews = require("../models/ProfileViewsModel")

const createProfileViews = (newProfileViews) => {
    return new Promise(async (resolve, reject) => {

        const { userId, recruiterId } = newProfileViews
        try {
            const createdProfileViews = await ProfileViews.create({
                userId: userId,
                recruiterId: recruiterId
            })
            if (createdProfileViews) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: createdProfileViews,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}



const getMyProfileViews = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const profileViews = await ProfileViews.find({
                userId: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (profileViews === null) {
                resolve({
                    status: 'ERR',
                    message: 'The profileViews is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: profileViews
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createProfileViews,
    getMyProfileViews,
}