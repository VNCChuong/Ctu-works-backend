const Recruiter = require("../models/RecruiterModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const { sendVerificationEmail } = require('./EmailService')
const crypto = require('crypto');
const createRecruiter = (newRecruiter) => {
    return new Promise(async (resolve, reject) => {
        const {
            role, firstName, lastName, companyName, phoneNumber
            , companyAddress, email, password, confirmPassword
            , companyDescription, businessLicense } = newRecruiter
        try {
            const checkUser = await User.findOne({
                email: email
            })
            const checkRecruiter = await Recruiter.findOne({
                email: email
            })
            if (checkUser !== null || checkRecruiter !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
                return
            }
            const checkPhoneUser = await User.findOne({
                phoneNumber: phoneNumber
            })
            const checkPhoneRecruiter = await Recruiter.findOne({
                phoneNumber: phoneNumber
            })
            if (checkPhoneUser !== null || checkPhoneRecruiter !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Phone number is already'
                })
                return
            }
            const hash = bcrypt.hashSync(password, 10)
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const createdRecruiter = await Recruiter.create({
                role,
                firstName,
                lastName,
                companyName,
                companyAddress,
                email,
                confirmPassword,
                companyDescription,
                businessLicense,
                password: hash,
                // confirmPassword: hash,
                phoneNumber
            })
            const verificationLink = `${process.env.APP_URL}/auth/verify/${verificationToken}`;
            await sendVerificationEmail(email, verificationLink);
            if (createdRecruiter) {
                resolve({
                    status: 'OK',
                    message: "Success",
                    data: createdRecruiter
                })

            }
        } catch (e) {
            reject(e)
        }
    })
}



const loginRecruiter = (recruiterLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkRecruiter = await User.findOne({
                email: email
            })
            if (checkRecruiter === null) {
                resolve({
                    status: 'ERR',
                    message: 'The recruiter is not defined'
                })
            }
            const comparePasswordRecruiter = bcrypt.compareSync(password, checkRecruiter.password)
            if (!comparePasswordRecruiter) {
                resolve({
                    status: 'ERR',
                    message: "The password is incorrect"
                })
            }
            const access_token = await genneralAccessToken({
                id: checkRecruiter.id,
                isAdmin: checkRecruiter.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: checkRecruiter.id,
                isAdmin: checkRecruiter.isAdmin
            })
            // console.log('access_token',access_token)
            resolve({
                status: 'OK',
                message: "Success",
                access_token,
                refresh_token
            })


        } catch (e) {
            reject(e)
        }
    })
}

const updateRecruiter = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRecruiter = await Recruiter.findOne({
                _id: id
            })
            if (checkRecruiter === null) {
                resolve({
                    status: 'OK',
                    message: 'The recruiter is not defined'
                })
            }
            const updateRecruiter = await Recruiter.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: "Success",
                data: updateRecruiter
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteRecruiter = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkRecruiter = await Recruiter.findOne({
                _id: id
            })
            if (checkRecruiter === null) {
                resolve({
                    status: 'OK',
                    message: 'The Recruiter is not defined'
                })
            }
            await Recruiter.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete Recruiter success",
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getAllRecruiter = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allRecruiter = await Recruiter.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: "Success",
                data: allRecruiter
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getDetailsRecruiter = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const recruiter = await Recruiter.findOne({
                _id: id
            })
            if (recruiter === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: "Success",
                data: recruiter
            })


        } catch (e) {
            reject(e)
        }
    })
}


const deleteManyRecruiter = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await Recruiter.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete Recruiter success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const changePasswordRecruiter = (userInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, oldPass, newPass } = userInfo
            const checkRecruiter = await Recruiter.findOne({
                _id: id
            })
            if (checkRecruiter === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Recruiter is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(oldPass, checkRecruiter.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: "The password is incorrect 1"
                })
            }
            const hash = bcrypt.hashSync(newPass, 10)
            const updateRecruiter = await Recruiter.findByIdAndUpdate(
                {
                    _id: id,
                },
                {
                    password: hash
                },
                {
                    new: true
                }
            )
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            // console.log('access_token',access_token)
            resolve({
                status: 'OK',
                message: "Success",
                access_token,
                refresh_token
            })


        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    loginRecruiter,
    getAllRecruiter,
    getDetailsRecruiter,
    deleteManyRecruiter,
    createRecruiter,
    updateRecruiter,
    deleteRecruiter,
    changePasswordRecruiter
}
