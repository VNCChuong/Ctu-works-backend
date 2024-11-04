const UserViewsHistoryService = require('../services/UserViewsHistoryService')

const create = async (req, res) => {
    try {
    
        const { userId, recruiterId } = req.body
        if (!userId || !recruiterId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await UserViewsHistoryService.create(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const get = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await UserViewsHistoryService.get(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    create,
    get,

}