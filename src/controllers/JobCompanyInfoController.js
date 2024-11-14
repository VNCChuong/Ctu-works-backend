const JobCompanyInfo = require('../services/JobCompanyInfoService')

const createJobCompanyInfo = async (req, res) => {
    try {
        const { companyName, companyAddress, companySize, companyStaffName, companyBenefits } = req.body
        if (!companyName || !companyAddress || !companySize || !companyStaffName || !companyBenefits) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await JobCompanyInfo.createJobCompanyInfo(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateJobCompanyInfo = async (req, res) => {
    try {
        const { id, data } = req.body
        if (!id || !data) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await JobCompanyInfo.updateJobCompanyInfo(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteJobCompanyInfo = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await JobCompanyInfo.deleteJobCompanyInfo(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getJobCompanyInfo = async (req, res) => {
    try {
        const { id } = req.body
        const { jobpostId } = req.body
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        // console.log(id)
        const response = await JobCompanyInfo.getJobCompanyInfo(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createJobCompanyInfo,
    updateJobCompanyInfo,
    deleteJobCompanyInfo,
    getJobCompanyInfo,
}