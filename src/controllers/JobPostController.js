const JobPostService = require('../services/JobPostService')

const createJobPost = async (req, res) => {
    try {
        const { companyName, companyScale, companyAddress, staffName, jobTitle, expirationDate,
            location, jobDescription, jobRequirements, benefits, jobInformation, salary
        } = req.body
        if (!companyName) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await JobPostService.createJobPost(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateJobPost = async (req, res) => {
    try {
        const jobPostId = req.params.id
        if (!jobPostId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The jobPostId is required'
            })
        }
        const response = await JobPostService.updateJobPost(jobPostId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteJobPost = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await JobPostService.deleteJobPost(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllJobPost = async (req, res) => {
    try {
        // const response = await JobPostService.getAllJobPost()
        const { g, level } = req.query
        // console.log(filter)
        const response = await JobPostService.getAllJobPost(req.query)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getMyJobPost = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await JobPostService.getMyJobPost(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsJobPost = async (req, res) => {
    try {
        const jobPostId = req.params.id
        if (!jobPostId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The jobPostId is required'
            })
        }
        const response = await JobPostService.getDetailsJobPost(jobPostId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelJobPost = async (req, res) => {
    try {
        const jobPostId = req.params.id
        if (!jobPostId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The jobPostId is required'
            })
        }
        const response = await JobPostService.cancelJobPost(jobPostId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteManyJobPost = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await JobPostService.deleteManyJobPost(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
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