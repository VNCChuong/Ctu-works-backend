const Recruiter = require("../models/RecruiterModel")
const User = require("../models/UserModel")
const Company = require("../models/CompanyModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const { sendVerificationEmail } = require('./EmailService')
const crypto = require('crypto');
const createRecruiter = (newRecruiter) => {
    return new Promise(async (resolve, reject) => {
        const {
            fullName, companyName, phoneNumber, companyScale
            , companyAddress, companyWebsite, companyFacebook, email, password, confirmPassword
            , companyDescription, businessLicense, companyIndustries } = newRecruiter
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
            const company = await Company.create({
                companyName,
                companyAddress,
                companyScale,
                phoneNumber,
                companyIndustries,
                companyWebsite,
                companyFacebook,
                companyDescription,
            })
            const createdRecruiter = await Recruiter.create({
                fullName,
                email,
                password: hash,
                companyId: company._id,
                businessLicense,
                verificationToken,
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
        const { email, password } = recruiterLogin
        try {
            const checkRecruiter = await Recruiter.findOne({
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
            if (!checkRecruiter.isVerified) {
                resolve({
                    status: 'ERR',
                    message: "Account not verified"
                })
            }
            const access_token = await genneralAccessToken({
                userid: checkRecruiter.id,
                email: checkRecruiter.email,
                fullName: checkRecruiter.fullName,
                role: checkRecruiter.role
            })
            const refresh_token = await genneralRefreshToken({
                userid: checkRecruiter.id,
                email: checkRecruiter.email,
                fullName: checkRecruiter.fullName,
                role: checkRecruiter.role
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
            const { formData } = data
            const checkRecruiter = await Recruiter.findOne({
                _id: id
            })
            if (checkRecruiter === null) {
                resolve({
                    status: 'OK',
                    message: 'The recruiter is not defined'
                })
            }
            const { companyName, phoneNumber, companyLogo, companyAddress, companyWebsite
                , companyFacebook, companyBenefits, companyScale, companyDescription, staffName, companyIndustries } = formData
            const dataCompany = {
                companyName, companyAddress, companyScale, phoneNumber, companyWebsite,
                companyFacebook, companyBenefits, companyLogo, companyDescription, staffName, companyIndustries
            }
            const arrBenefits = Object.values(companyBenefits);
            let arrayBenefit = [];
            const newArrayBenefit = arrBenefits.map((item, index) => {
                if (item !== null) {
                    arrayBenefit.push(item);
                }
            });
            const updadteCompany = await Company.findByIdAndUpdate(formData.companyId, {
                companyName, companyAddress, companyScale, phoneNumber, companyWebsite,
                companyFacebook, companyBenefits: arrayBenefit, companyLogo, companyDescription, staffName, companyIndustries
            }, { new: true })
            const updateRecruiter = await Recruiter.findByIdAndUpdate(id, formData, { new: true })
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
            const { _id, role, companyId, email, locationCompanyId,
                fullName, isVerified, createdAt, updatedAt } = recruiter
            const company = await Company.findById(recruiter.companyId)
            const {
                companyName, companyAddress, phoneNumber, companyWebsite, companyFacebook,
                companyBenefits, companyLogo, staffName, companyScale, companyDescription,
                follower, following, companyIndustries
            } = company
            const results = {
                _id, role, companyId, email, locationCompanyId,
                fullName, isVerified, follower, following, createdAt, updatedAt,
                companyName, companyAddress, phoneNumber, companyWebsite, companyFacebook,
                companyBenefits, companyLogo, staffName, companyScale, companyDescription, companyIndustries
            };
            resolve({
                status: 'OK',
                message: "Success",
                data: results
            })


        } catch (e) {
            reject(e)
        }
    })
}

const getAllRecruiterCompany = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCompany = await Company.find().sort({ createdAt: -1, updatedAt: -1 })
            const results = await Promise.all(allCompany.map(async (company) => {
                const recruiter = await Recruiter.findOne({ companyId: company._id })
                return {
                    ...company._doc,
                    recruiterName: recruiter.fullName,
                    recruiterEmail: recruiter.email,
                    recruiterPhone: recruiter.phoneNumber,
                    recruiterId: recruiter._id,
                }
            }))
            console.log(results)
            resolve({
                status: 'OK',
                message: "Success",
                data: results
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


const createLocation = (recruiterId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await Recruiter.findOne({
                _id: recruiterId
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const createLocation = await Recruiter.updateOne(
                { _id: recruiterId },
                { $push: { location: data } }
            ).then(result => {
                // console.log("language added successfully:", result);
            }).catch(error => {
                // console.error("Error adding language:", error);
                resolve({
                    status: 'ERR',
                    message: "location added error",
                    data: createSkills
                })
            });
            resolve({
                status: 'OK',
                message: "location added successfully",
                data: createSkills
            })
        } catch (e) {
            reject(e)
        }
    })
}


const updateLocation = (recruiterId, locationId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await Recruiter.findById({
                _id: recruiterId
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const skills = await Recruiter.findOne({ 'location._id': skillsId });
            if (!skills) {
                resolve({
                    status: 'ERR',
                    message: "Location not found",
                })
            } else {
                await User.findByIdAndUpdate(
                    recruiterId,
                    { $pull: { location: { _id: locationId } } },
                    { new: true }
                );
                await User.updateOne(
                    { _id: recruiterId },
                    { $push: { location: data } }
                ).then(result => {
                    // console.log("Project update successfully:", result); 
                }).catch(error => {
                    // console.error("Error update project:", error);
                    resolve({
                        status: 'ERR',
                        message: "Location update error",
                    })
                });
                resolve({
                    status: 'OK',
                    message: "Location update successfully",
                })
            }
        } catch (e) {
            reject(e)

        }
    })
}

const deleteLocation = (recruiterId, locationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById({
                _id: recruiterId
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const language = await User.findOne({ 'location._id': locationId });
            if (!language) {
                resolve({
                    status: 'ERR',
                    message: "Location not found",
                })
            } else {
                await User.findByIdAndUpdate(
                    recruiterId,
                    { $pull: { location: { _id: locationId } } },
                    { new: true }
                );

                resolve({
                    status: 'OK',
                    message: "Location deleted successfully",
                })

            }
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
    changePasswordRecruiter,
    createLocation,
    updateLocation,
    deleteLocation,
    getAllRecruiterCompany
}
