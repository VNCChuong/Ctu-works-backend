const CandidateExpectations = require('../models/CandidateExpectationsModel')

const createCandidateExpectations = (newCandidateExpectations) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createdCandidateExpectations = await CandidateExpectations.create({
                newCandidateExpectations
            })
            if (true) {
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createdCandidateExpectations,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateCandidateExpectations = (newCandidateExpectations) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, data } = newCandidateExpectations
            const candidateExpectations = await CandidateExpectations.findById({
                _id: id
            })
            if (candidateExpectations === null) {
                resolve({
                    status: 'ERR',
                    message: 'The data is not defined'
                })
            }
            const updateCandidateExpectations = await CandidateExpectations.findByIdAndUpdate(
                id,
                data,
                { new: true }
            )
            if (updateCandidateExpectations) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: updateCandidateExpectations,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteCandidateExpectations = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await CandidateExpectations.findById({
                _id: id
            })
            if (check === null) {
                resolve({
                    status: 'OK',
                    message: 'The data is not defined'
                })
            }
            await CandidateExpectations.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete success",
            })
        } catch (e) {
            reject(e)
        }
    })
}



const getCandidateExpectations = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const candidateExpectations = await CandidateExpectations.find({
                _id: id
            })
            if (candidateExpectations === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Apply is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: candidateExpectations
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createCandidateExpectations,
    updateCandidateExpectations,
    deleteCandidateExpectations,
    getCandidateExpectations,
}