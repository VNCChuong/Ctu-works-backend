const JobViewsHistoryService = require('../services/JobViewsHistoryService')

const create = async (req, res) => {
    try {
        // console.log(req.body)
        const { userId, jobPostId } = req.body
        if (!userId || !jobPostId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await JobViewsHistoryService.create(req.body)
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
        const response = await JobViewsHistoryService.get(id)
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