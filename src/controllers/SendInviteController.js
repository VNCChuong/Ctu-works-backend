const SendInviteService = require('../services/SendInviteService')

const createSendInvite = async (req, res) => {
    try {
        const { userId, recruiterId } = req.body
        if (!userId || !recruiterId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await SendInviteService.createSendInvite(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteSendInvite = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await SendInviteService.deleteSendInvite(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getMySendInvite = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await SendInviteService.getMySendInvite(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelSendInvite = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await SendInviteService.cancelSendInvite(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createSendInvite,
    deleteSendInvite,
    getMySendInvite,
    cancelSendInvite
}