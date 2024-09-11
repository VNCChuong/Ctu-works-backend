const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const { sendVerificationEmail } = require('./EmailService')
const crypto = require('crypto');
const fs = require('fs')
const excelToJson = require('convert-excel-to-json')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { fullName, dateOfBirth, address, currentLevel, EnglishComputerSkills, educationHighest, workExperience,
            phoneNumber, desiredFields, email, password, confirmPassword, industry, MSSV, gender } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
            }
            const checkPhone = await User.findOne({
                phoneNumber: phoneNumber
            })
            if (checkPhone !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Phone number is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const createdUser = await User.create({
                fullName,
                dateOfBirth,
                phoneNumber,
                desiredFields,
                address,
                email,
                password: hash,
                verificationToken,
                // confirmPassword: hash,
                phoneNumber,
                seekJobMode: false,
                address,
                currentLevel, EnglishComputerSkills, educationHighest, workExperience,
                industry, MSSV, gender
            })
            const verificationLink = `https://ctu-works-backend.onrender.com/auth/verify/${verificationToken}`;
            await sendVerificationEmail(email, verificationLink);

            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: "Success",
                    data: createdUser
                })

            }
        } catch (e) {
            reject(e)
        }
    })
}


const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: "The password is incorrect 1"
                })
            }
            if (!checkUser.isVerified) {
                resolve({
                    status: 'ERR',
                    message: "Account not verified"
                })
            }
            const access_token = await genneralAccessToken({
                userid: checkUser.id,
                email: checkUser.email,
                fullName: checkUser.fullName,
                role: checkUser.role
            })

            const refresh_token = await genneralRefreshToken({
                userid: checkUser.id,
                email: checkUser.email,
                fullName: checkUser.fullName,
                role: checkUser.role
            })
            resolve({
                status: 'OK',
                message: "Login success",
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: "Success",
                data: updateUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: "Delete user success",
            })


        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: "Success",
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const today = new Date();
            if (user.seekJobModeExpiration < today) {
                await User.findByIdAndUpdate(
                    { _id: id },
                    {
                        seekJobMode: false,
                        seekJobModeExpiration: null,
                    }

                )
            }
            resolve({
                status: 'OK',
                message: "Success",
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const changePassword = (userInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, oldPass, newPass } = userInfo
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(oldPass, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: "The password is incorrect 1"
                })
            }
            const hash = bcrypt.hashSync(newPass, 10)
            await User.findByIdAndUpdate(
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
                userid: checkUser.id,
                email: checkUser.email,
                fullName: checkUser.fullName,
                role: checkUser.role
            })

            const refresh_token = await genneralRefreshToken({
                userid: checkUser.id,
                email: checkUser.email,
                fullName: checkUser.fullName,
                role: checkUser.role
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

const updateSeekJob = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + 15);
            await User.findByIdAndUpdate(
                { _id: id },
                {
                    seekJobMode: !checkUser.seekJobMode,
                    seekJobModeExpiration: !checkUser.seekJobMode ? newDate : null,
                }

            )
            resolve({
                status: 'OK',
                message: 'update user seekjobmode success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const uploadfile = (path) => {
    return new Promise(async (resolve, reject) => {
        try {
            // -> Read Excel File to Json Data
            const excelData = excelToJson({
                sourceFile: path,
                sheets: [{
                    // Excel Sheet Name
                    name: 'Table',

                    // Header Row -> be skipped and will not be present at our result object.
                    header: {
                        rows: 1
                    },

                    // Mapping columns to keys
                    columnToKey:
                    {
                        A: 'email',
                        B: 'phoneNumber',
                        C: 'MSSV',
                        D: 'lastName',
                        E: 'dateOfBirth',
                        F: 'gender',
                        G: 'industry'

                    }
                }]
            });
            User.insertMany(excelData.Table)
            fs.unlinkSync(path)
            resolve({
                status: 'OK',
                message: 'Create user from file success',
            })
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    changePassword,
    updateSeekJob,
    uploadfile
}
