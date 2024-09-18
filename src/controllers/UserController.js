const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const { fullName, phoneNumber, email, password,
            dateOfBirth, gender, country, city, district, address, maritalStatusId,
            jobTitle, yearsExperience, currentDegree, highestDegree, currentSalary, currentJobFunction, currentIndustries,
            skillName,
            // locations, jobFunction, companyIndustries, salary, desiredJobLevel, 
            workingPreferences,
            confirmPassword, MSSV, } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!fullName || !phoneNumber || !email || !password || !confirmPassword ||
            !dateOfBirth || !gender || !country || !city || !district || !maritalStatusId ||
            !jobTitle || !yearsExperience || !currentDegree || !highestDegree || !currentSalary || !currentJobFunction || !currentIndustries ||
            !skillName ||
            !workingPreferences.companyIndustries
        ) {
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
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
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
        const response = await UserService.loginUser(req.body)
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

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
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


const logoutUser = async (req, res) => {
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


const changePassword = async (req, res) => {
    try {
        const { id, oldPass, newPass } = req.body
        if (!id || !oldPass || !newPass) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.changePassword(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateSeekJob = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateSeekJob(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const uploadfile = async (req, res) => {
    try {
        const path = req.file.path
        if (!path) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.uploadfile(path)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUserWorkPreferences = async (req, res) => {
    try {
        const userId = req.params.id
        const { workingPreferences } = req.body
        if (!workingPreferences.locations || !workingPreferences.jobFunction || !workingPreferences.companyIndustries || !workingPreferences.desiredJobLevel || !workingPreferences.salary) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateUserWorkPreferences(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createProject = async (req, res) => {
    try {
        const userId = req.params.id
        const { projectName, companyName, yourRole, description } = req.body
        if (!projectName || !companyName || !yourRole || !description) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.createProject(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateProject = async (req, res) => {
    try {
        const userId = req.params.id
        const { projectId, projectName, companyName, fromDate, toDate, projectLink, logo, yourRole, description } = req.body
        const data = { projectName, companyName, fromDate, toDate, projectLink, logo, yourRole, description }
        if (!projectId || !projectName || !companyName || !yourRole || !description) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateProject(userId, projectId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteProject = async (req, res) => {
    try {
        const userId = req.params.id
        const { projectId } = req.body

        if (!projectId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.deleteProject(userId, projectId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createWorkingHistories = async (req, res) => {
    try {
        const userId = req.params.id
        const { jobTitle, companyName, description } = req.body
        if (!jobTitle || !companyName || !description) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.createWorkingHistories(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateWorkingHistories = async (req, res) => {
    try {
        const userId = req.params.id
        const { workingHistoriesId, jobTitle, companyName, fromDate, toDate, isCurrent, companyLogo, description } = req.body
        const data = { jobTitle, companyName, fromDate, toDate, isCurrent, companyLogo, description }
        if (!workingHistoriesId || !companyName || !description) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateWorkingHistories(userId, workingHistoriesId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteWorkingHistories = async (req, res) => {
    try {
        const userId = req.params.id
        const { workingHistoriesId } = req.body

        if (!workingHistoriesId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.deleteWorkingHistories(userId, workingHistoriesId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createEducations = async (req, res) => {
    try {
        const userId = req.params.id
        const { major, schoolName, highestDegree } = req.body
        if (!major || !schoolName || !highestDegree) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.createEducations(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateEducations = async (req, res) => {
    try {
        const userId = req.params.id
        const { educationsId, major, schoolName, highestDegree, fromDate, toDate, achievement } = req.body
        const data = { major, schoolName, highestDegree, fromDate, toDate, achievement }
        if (!educationsId || !major || !schoolName || !highestDegree) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateEducations(userId, educationsId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteEducations = async (req, res) => {
    try {
        const userId = req.params.id
        const { educationsId } = req.body

        if (!educationsId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.deleteEducations(userId, educationsId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const createCertifications = async (req, res) => {
    try {
        const userId = req.params.id
        const { certification, organization } = req.body
        if (!certification || !organization) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.createCertifications(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateCertifications = async (req, res) => {
    try {
        const userId = req.params.id
        const { certificationsId, certification, organization, logo, fromDate, linkCertification } = req.body
        const data = { certification, organization, logo, fromDate, linkCertification }
        if (!certificationsId || !certification || !organization) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateCertifications(userId, certificationsId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteCertifications = async (req, res) => {
    try {
        const userId = req.params.id
        const { certificationsId } = req.body

        if (!certificationsId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.deleteCertifications(userId, certificationsId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const createActivities = async (req, res) => {
    try {
        const userId = req.params.id
        const { activity, title, organization } = req.body
        if (!activity || !title || !organization) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.createActivities(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateActivities = async (req, res) => {
    try {
        const userId = req.params.id
        const { activitiesId, activity, title, organization, fromDate, toDate, isCurrent, description } = req.body
        const data = { activity, title, organization, fromDate, toDate, isCurrent, description }
        if (!activitiesId || !activity || !title || !organization) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateActivities(userId, activitiesId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteActivities = async (req, res) => {
    try {
        const userId = req.params.id
        const { activitiesId } = req.body

        if (!activitiesId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.deleteActivities(userId, activitiesId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createLanguage = async (req, res) => {
    try {
        const userId = req.params.id
        const { nameLanguage, languageLevel, } = req.body
        if (!nameLanguage || !languageLevel) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.createLanguage(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateLanguage = async (req, res) => {
    try {
        const userId = req.params.id
        const { languageId, nameLanguage, languageLevel } = req.body
        const data = { nameLanguage, languageLevel }
        data.languageLevel = Math.max(1, Math.min(data.languageLevel, 4));
        if (!languageId || !nameLanguage || !languageLevel) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateLanguage(userId, languageId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteLanguage = async (req, res) => {
    try {
        const userId = req.params.id
        const { languageId } = req.body

        if (!languageId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.deleteLanguage(userId, languageId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const createSkills = async (req, res) => {
    try {
        const userId = req.params.id
        const { skillName, skillLevel, } = req.body
        if (!skillName || !skillLevel) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.createSkills(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateSkills = async (req, res) => {
    try {
        const userId = req.params.id
        const { skillsId, skillName, skillLevel } = req.body
        const data = { skillName, skillLevel }
        data.skillLevel = Math.max(1, Math.min(data.skillLevel, 5));
        if (!skillsId || !skillName || !skillLevel) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.updateSkills(userId, skillsId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const deleteSkills = async (req, res) => {
    try {
        const userId = req.params.id
        const { skillsId } = req.body

        if (!skillsId) {
            return res.status(200).json({
                status: "ERR",
                message: "Input required"
            })
        }
        const response = await UserService.deleteSkills(userId, skillsId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const updateIntroduce = async (req, res) => {
    try {
        const userId = req.params.id
        const { data } = req.body
        const response = await UserService.updateIntroduce(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany,
    changePassword,
    updateSeekJob,
    uploadfile,
    updateUserWorkPreferences,
    createProject,
    updateProject,
    deleteProject,
    createWorkingHistories,
    updateWorkingHistories,
    deleteWorkingHistories,
    createEducations,
    updateEducations,
    deleteEducations,
    createCertifications,
    updateCertifications,
    deleteCertifications,
    createActivities,
    updateActivities,
    deleteActivities,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    createSkills,
    updateSkills,
    deleteSkills,
    updateIntroduce,
}