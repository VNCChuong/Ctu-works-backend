const SaveJobService = require('../services/SaveJobService')

const createSaveJob = async (req, res) => {
    try {
        const { userId, jobPostId } = req.body
        if (!userId || !jobPostId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await SaveJobService.createSaveJob(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteSaveJob = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await SaveJobService.deleteSaveJob(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getMySaveJob = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await SaveJobService.getMySaveJob(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createSaveJob,
    deleteSaveJob,
    getMySaveJob,
}