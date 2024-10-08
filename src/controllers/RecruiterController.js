const { create } = require('../models/RecruiterModel')
const RecruiterService = require('../services/RecruiterService')

const createRecruiter = async (req, res) => {
    try {
        const { fullName, phoneNumber,
            companyName, email, companyAddress, companyScale, companyIndustries,
            companyWebsite, companyFacebook, companyDescription,
            businessLicense, password, confirmPassword } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        
        if (!fullName || !companyName || !phoneNumber
            || !companyAddress || !email || !password || !confirmPassword 
            || !companyDescription || !businessLicense) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }
        const response = await RecruiterService.createRecruiter(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const loginRecruiter = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await RecruiterService.loginRecruiter(req.body)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/'
        })
        return res.status(200).json({ ...newReponse, refresh_token })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateRecruiter = async (req, res) => {
    try {
        const RecruiterId = req.params.id
        const data = req.body
        if (!RecruiterId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The RecruiterId is required'
            })
        }
        const response = await RecruiterService.updateRecruiter(RecruiterId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteRecruiter = async (req, res) => {
    try {
        const RecruiterId = req.params.id
        if (!RecruiterId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The RecruiterId is required'
            })
        }
        const response = await RecruiterService.deleteRecruiter(RecruiterId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllRecruiter = async (req, res) => {
    try {
        const response = await RecruiterService.getAllRecruiter()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsRecruiter = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await RecruiterService.getDetailsRecruiter(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.body.headers.token?.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        console.error('Error refreshing token:', e);
        return res.status(404).json({
            message: e
        })
    }
}


const logoutRecruiter = async (req, res) => {
    try {
        res.clearCookie('refresh_token', {
            sameSite: "none",
            secure: true,
        });
        res.clearCookie('access_token', {
            sameSite: "none",
            secure: true,
        });
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyRecruiter = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await RecruiterService.deleteManyRecruiter(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const changePasswordRecruiter = async (req, res) => {
    try {
        const { id, oldPass, newPass } = req.body
        if (!id || !oldPass || !newPass) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await RecruiterService.changePasswordRecruiter(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const createLocation = async (req, res) => {
    try {
        const recruiterId = req.params.id
        const { locationName, address, } = req.body
        if (!locationName || !address) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await RecruiterService.createLocation(recruiterId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateLocation = async (req, res) => {
    try {
        const recruiterId = req.params.id
        const { locationId, locationName, address } = req.body
        const data = { locationName, address }
        if (!locationId || !locationName || !address) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await RecruiterService.updateLocation(recruiterId, locationId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteLocation = async (req, res) => {
    try {
        const userId = req.params.id
        const { locationId } = req.body

        if (!locationId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await RecruiterService.deleteLocation(userId, locationId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    loginRecruiter,
    getAllRecruiter,
    getDetailsRecruiter,
    refreshToken,
    logoutRecruiter,
    deleteManyRecruiter,
    createRecruiter,
    updateRecruiter,
    deleteRecruiter,
    changePasswordRecruiter,
    createLocation,
    updateLocation,
    deleteLocation
}