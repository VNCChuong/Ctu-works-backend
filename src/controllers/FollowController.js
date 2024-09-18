
const FollowService = require('../services/FollowService')

const createFollow = async (req, res) => {
    try {
        const recruiterId = req.params.id
        const { userId } = req.body
        if (!recruiterId || !userId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await FollowService.createFollow(recruiterId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteFollow = async (req, res) => {
    try {
        const followId = req.params.id
        const { userId, recruiterId } = req.body
        if (!followId && !(userId, recruiterId)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await FollowService.deleteFollow(followId, userId, recruiterId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
        console.log(e)
    }
}


const getMyFollow = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await FollowService.getMyFollow(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createFollow,
    deleteFollow,
    getMyFollow
}   