const SearchHistory = require("../models/SearchHistoryModel")
const createSearchHistory = (newSearchHistory) => {
    return new Promise(async (resolve, reject) => {
        const { userId, description } = newSearchHistory
        try {
            const createdSearchHistory = await SearchHistory.create({
                userId: userId,
                description: description,
            })
            if (createdSearchHistory) {
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: createdSearchHistory,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}



const getMySearchHistory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const searchHistory = await SearchHistory.find({
                userId: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (searchHistory === null) {
                resolve({
                    status: 'ERR',
                    message: 'The search history is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: searchHistory
            })
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createSearchHistory,
    getMySearchHistory,
}