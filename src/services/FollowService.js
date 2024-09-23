const Recruiter = require("../models/RecruiterModel");
const Follow = require("../models/FollowModel");
const JobPost = require("../models/JobPostModel");
const createFollow = (recruiterId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRecruiter = await Recruiter.findOne({
                _id: recruiterId
            })
            const companyJob = await JobPost.find({
                recruiter: recruiterId
            })
            const jobCount = companyJob.length;
            if (checkRecruiter === null) {
                resolve({
                    status: 'ERR',
                    message: 'The recruiter is not defined'
                })
            }
            const checkFollow = await Follow.findOne({
                recruiterId: recruiterId,
                userId: data.userId,
            })
            if (checkFollow) {
                resolve({
                    status: 'ERR',
                    message: 'The Follow is already exist'
                })
            }
            const createdFollow = await Follow.create({
                recruiterId: recruiterId,
                companyName: checkRecruiter.companyName,
                companyIndustries: checkRecruiter.companyIndustries,
                companyFollowing: checkRecruiter.following,
                companyLogo: checkRecruiter.companyLogo,
                companyJob: jobCount,
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
            if (followId) {
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
                    { _id: checkFollow.recruiterId.toHexString() }
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