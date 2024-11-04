const Recruiter = require("../models/RecruiterModel");
const Follow = require("../models/FollowModel");
const Company = require("../models/CompanyModel");
const JobPost = require("../models/JobPostModel");
const createFollow = (recruiterId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRecruiter = await Recruiter.findOne({
                _id: recruiterId
            })
            const companyId = checkRecruiter.companyId.toHexString();
            const checkCompany = await Company.findById({
                _id: companyId
            })
            const companyJob = await JobPost.find({
                recruiterId: recruiterId
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
                companyId: companyId,
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
                companyId: companyId,
                // companyName: checkRecruiter.companyName,
                // companyIndustries: checkRecruiter.companyIndustries,
                // companyFollowing: checkRecruiter.following,
                // companyLogo: checkRecruiter.companyLogo,
                // companyJob: jobCount,
                ...data
            })
            await Company.findByIdAndUpdate(
                { _id: companyId }
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
            console.log(followId, userId, recruiterId)
            const follow = await Follow.find({ _id: followId })
            if (follow.length === 1) {
                const checkFollow = await Follow.findOne({
                    _id: followId
                })
                if (checkFollow === null) {
                    resolve({
                        status: 'ERR',
                        message: 'The Follow is not defined'
                    })
                }
                await Company.findByIdAndUpdate(
                    { _id: checkFollow.companyId.toHexString() }
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
                await Company.findByIdAndUpdate(
                    { _id: checkFollow.companyId.toHexString() }
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
            const results = await Promise.all(follow.map(async (fol) => {
                const company = await Company.findById({ _id: fol.companyId.toHexString() })
                return {
                    ...fol._doc,
                    companyName: company.companyName,
                    companyIndustries: company.companyIndustries,
                    companyFollowing: company.following,
                    companyLogo: company.companyLogo,
                    companyJob: company.companyJob,
                }
            }))
            if (follow === null) {
                resolve({
                    status: 'ERR',
                    message: 'The follow is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: results
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