const SearchHistoryService = require('../services/SearchHistoryService')

const createSearchHistory = async (req, res) => {
    try {
        const { userId, description } = req.body
        if (!userId || !description) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await SearchHistoryService.createSearchHistory(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getMySearchHistory = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await SearchHistoryService.getMySearchHistory(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createSearchHistory,
    getMySearchHistory,
}