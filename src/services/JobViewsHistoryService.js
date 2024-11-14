const JobViewsHistory = require("../models/JobViewsHistoryModel")
const { getDetailsJobPost } = require("../services/JobPostService")
const create = (newCreate) => {
    return new Promise(async (resolve, reject) => {

        const { userId, jobPostId, timeSpent } = newCreate
        try {
            const check = await JobViewsHistory.findOne({ userId: userId, jobPostId: jobPostId })
            if (check === null) {
                const create = await JobViewsHistory.create({
                    userId: userId,
                    jobPostId: jobPostId,
                    timeSpent: timeSpent
                })
                if (create) {
                    resolve({
                        status: 'OK',
                        message: 'success',
                        data: create,
                    })
                }
            } else {
                const result = await JobViewsHistory.updateOne({ userId: userId, jobPostId: jobPostId },{ timeSpent: check.timeSpent + timeSpent })
                check.save()
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
        const profileViews = await JobViewsHistory.find({
            userId: id
        }).sort({ createdAt: -1, updatedAt: -1 })

        if (!profileViews) {
            return {
                status: 'ERR',
                message: 'The profileViews is not defined'
            }
        }

        const data = await Promise.all(profileViews.map(async (item) => {
            try {
                const jobdetails = await getDetailsJobPost(item.jobPostId.toString())
                return jobdetails.data
            } catch (e) {
                console.error(`Error getting job details for ${item.jobPostId}:`, e)
                return null
            }
        }))
        // console.log(data)
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: data
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