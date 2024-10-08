const CandidateExpectationsService = require('../services/CandidateExpectationsService')

const createCandidateExpectations = async (req, res) => {
    try {
        const { keywords, jobField, language, minExperience, nationality,
            educationLevel, gender, minAge, maxAge, maritalStatus } = req.body
        if (!keywords || !jobField || !language || !minExperience || !nationality 
            || !educationLevel || !gender || !minAge || !maxAge || !maritalStatus) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await CandidateExpectationsService.createCandidateExpectations(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateCandidateExpectations = async (req, res) => {
    try {
        const { id, data } = req.body
        if (!id || !data) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await CandidateExpectationsService.updateCandidateExpectations(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteCandidateExpectations = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await CandidateExpectationsService.deleteCandidateExpectations(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getCandidateExpectations = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await CandidateExpectationsService.getCandidateExpectations(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createCandidateExpectations,
    updateCandidateExpectations,
    deleteCandidateExpectations,
    getCandidateExpectations,
}