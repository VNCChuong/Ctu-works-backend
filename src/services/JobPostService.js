const JobPost = require("../models/JobPostModel")

const createJobPost = (newJobPost) => {
    return new Promise(async (resolve, reject) => {
        const { companyName, companyScale, email, companyAddress, staffName, companyLogo, jobTitle, expirationDate,
            location, jobDescription, jobRequirements, benefits, jobInformation, salary, keywords, recruiter } = newJobPost
        try {
            const createdJobPost = await JobPost.create({
                email,
                companyName,
                companyScale,
                companyAddress,
                companyLogo,
                staffName,
                jobTitle,
                expirationDate,
                location,
                jobDescription,
                jobRequirements,
                benefits,
                jobInformation,
                salary,
                recruiter: recruiter,
                keywords,
                postViews: 0,
                statusSeeking: true,
            })
            if (createdJobPost) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: createdJobPost,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateJobPost = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobPost = await JobPost.findById({
                _id: id
            })

            if (jobPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The JobPost is not defined'
                })
            }
            const jobPostUpdate = await JobPost.findByIdAndUpdate(
                {
                    _id: id,
                }, data,
                { $set: { status: true } },
                { new: true }
            )
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: jobPostUpdate
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteJobPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkJobPost = await JobPost.findOne({
                _id: id
            })
            if (checkJobPost === null) {
                resolve({
                    status: 'OK',
                    message: 'The JobPost is not defined'
                })
            }
            await JobPost.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete jobpost success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getAllJobPost = (filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { jobTitle, location, ...otherFilters } = filter;

            // Create a filter object based on the provided filter
            const filterObject = {
                $and: [
                    jobTitle ? { jobTitle: { $regex: jobTitle, $options: 'i' } } : {},
                    location ? { location: { $regex: location, $options: 'i' } } : {},
                    // Add other filters as needed
                    ...Object.entries(otherFilters).map(([key, value]) => ({ [key]: { $regex: value, $options: 'i' } }))
                ]
            };
            console.log(filterObject)
            // Find job posts based on the filter object and sort them
            const totalJobPost = await JobPost.find(filterObject).sort({ createdAt: -1, updatedAt: -1 });
            // const totalJobPost = await JobPost.find({ "jobInformation.industry": "Kế Toán" })
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: totalJobPost
            })
        } catch (e) {
            reject(e)
        }
    })
}


const getMyJobPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobPost = await JobPost.find({
                recruiter: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (jobPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The jobPost is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: jobPost
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getDetailsJobPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobPost = await JobPost.findByIdAndUpdate(
                {
                    _id: id
                }, {
                $inc: {
                    postViews: + 1
                }
            }
            )
            if (jobPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The jobPost is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: jobPost

            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelJobPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jobPost = await JobPost.findByIdAndUpdate(
                {
                    _id: id,
                },
                { $set: { status: false } },
                { new: true }
            )

            if (jobPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The jobPost is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: jobPost
            })
        } catch (e) {
            reject(e)
        }
    })
}


const deleteManyJobPost = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await JobPost.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createJobPost,
    updateJobPost,
    deleteJobPost,
    getAllJobPost,
    getMyJobPost,
    getDetailsJobPost,
    cancelJobPost,
    deleteManyJobPost,
}