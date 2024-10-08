const LocationCompany = require('../models/locationCompanyModel')
const Recruiter = require('../models/RecruiterModel')

const create = (newLocation) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { recruiterId, title, description } = newLocation
            const recruiter = await Recruiter.findById(recruiterId);
            const created = await LocationCompany.create({
                title, description
            })
            recruiter.locationCompanyId.push(created._id)
            recruiter.save()
            if (true) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: created,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const update = (id, newLocation) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { title, description } = newLocation
            const data = { title, description }
            const location = await LocationCompany.findById({
                _id: id
            })
            if (location === null) {
                resolve({
                    status: 'ERR',
                    message: 'The data is not defined'
                })
            }
            const updateLocation = await LocationCompany.findByIdAndUpdate(
                id,
                data,
                { new: true }
            )
            if (updateLocation) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: updateLocation,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteLocation = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await LocationCompany.findById({
                _id: id
            })
            if (check === null) {
                resolve({
                    status: 'OK',
                    message: 'The data is not defined'
                })
            }
            const checkRecruiter = await Recruiter.findOne({ locationCompanyId: id })
            checkRecruiter.locationCompanyId.pull(id)
            checkRecruiter.save()
            await LocationCompany.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const get = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const location = await LocationCompany.find({
                _id: id
            })
            if (location === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Apply is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: location
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    create,
    update,
    deleteLocation,
    get,
}