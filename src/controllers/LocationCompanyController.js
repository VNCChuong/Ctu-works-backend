const LocationCompanyService = require('../services/LocationCompanyService')

const create = async (req, res) => {
    try {
        const { recruiterId, title, description } = req.body
        if (!recruiterId || !title || !description) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await LocationCompanyService.create(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const update = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description } = req.body
        if (!id || !title || !description) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await LocationCompanyService.update(id, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await LocationCompanyService.deleteLocation(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const get = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The id is required'
            })
        }
        const response = await LocationCompanyService.get(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    create,
    update,
    deleteLocation,
    get,
}