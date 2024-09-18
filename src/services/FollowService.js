const Recruiter = require("../models/RecruiterModel");
const Follow = require("../models/FollowModel");
const createFollow = (recruiterId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkReccruiter = await Recruiter.findOne({
                _id: recruiterId
            })
            if (checkReccruiter === null) {
                resolve({
                    status: 'ERR',
                    message: 'The recruiter is not defined'
                })
            }
            const checkFollow = await Follow.findOne({
                recruiterId: recruiterId,
                userId: data.userId
            })
            if (checkFollow) {
                resolve({
                    status: 'ERR',
                    message: 'The Follow is already exist'
                })
            }
            const createdFollow = await Follow.create({
                recruiterId: recruiterId,
                ...data
            })
            await Recruiter.findByIdAndUpdate(
                { _id: recruiterId }
                ,
                {
                    $push: {
                        follower: data.userId
                    },
                    $inc: {
                        following: +1
                    }
                },
                { new: true }
            )
            resolve({
                status: 'OK',
                message: "Follow added successfully",
                data: createdFollow
            })
        } catch (e) {
            reject(e)
        }
    })
}


const deleteFollow = (followId, userId, recruiterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!followId) {
                const checkFollow = await Follow.findOne({
                    _id: followId
                })
                if (checkFollow === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The Follow is not defined'
                    })
                }
                await Recruiter.findByIdAndUpdate(
                    recruiterId
                    ,
                    {
                        $pull: {
                            follower: userId
                        },
                        $inc: {
                            following: -1
                        }
                    },
                    { new: true }
                )
                await Follow.findOneAndDelete({
                    _id: followId
                })
                resolve({
                    status: 'OK',
                    message: "Delete Follow success",
                })
            } else {
                const checkFollow = await Follow.findOne({
                    userId: userId,
                    recruiterId: recruiterId
                })
                await Recruiter.findByIdAndUpdate(
                    { _id: recruiterId }
                    ,
                    {
                        $pull: {
                            follower: userId
                        },
                        $inc: {
                            following: -1
                        }
                    },
                    { new: true }
                )
                if (checkFollow === null) {
                    resolve({
                        status: 'OK',
                        message: 'The Follow is not defined'
                    })
                }
                await Follow.findOneAndDelete({
                    userId: userId,
                    recruiterId: recruiterId
                })
                resolve({
                    status: 'OK',
                    message: "Delete Follow success",
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}



const getMyFollow = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const follow = await Follow.find({
                userId: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (follow === null) {
                resolve({
                    status: 'ERR',
                    message: 'The follow is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: follow
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createFollow,
    deleteFollow,
    getMyFollow
}