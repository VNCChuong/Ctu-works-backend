const CreateJobpostAiService = require('../services/CreateJobpostAiService')
const createJob = async (req, res) => {
    try {
        // console.log(req.body)
        const { data } = req.body
        const response = await CreateJobpostAiService.createJob(data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetails = async (req, res) => {
    try {
        const id = req.params.id
        // const { jobpostId } = req.body
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await CreateJobpostAiService.getDetails(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createJob,
    getDetails,

}