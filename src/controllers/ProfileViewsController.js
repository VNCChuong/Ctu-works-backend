const ProfileViewsService = require('../services/ProfileViewsService')

const createProfileViews = async (req, res) => {
    try {
        const { userId, recruiterId } = req.body
        if (!userId || !recruiterId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await ProfileViewsService.createProfileViews(req.body)
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


const getMyProfileViews = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await ProfileViewsService.getMyProfileViews(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createProfileViews,
    deleteSaveJob,
    getMyProfileViews,

}