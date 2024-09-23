const express = require("express")
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: true }))
// router.use(express.static(path.resole(__dirname, '../uploads')))
global._basedir = __dirname

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, _basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage })


router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)

router.put('/change-password', UserController.changePassword)
router.put('/update-user/:id', UserController.updateUser)
router.put('/update-seek-job-mode/:id', UserController.updateSeekJob)

router.delete('/delete-user/:id', UserController.deleteUser)

router.get('/log-out', UserController.logoutUser)
router.get('/getAll', UserController.getAllUser)
router.get('/get-details/:id', UserController.getDetailsUser)

router.post('/delete-many', UserController.deleteMany)
router.post('/refresh-token', UserController.refreshToken)
router.post('/uploadfile', upload.single('file'), UserController.uploadfile)

router.put('/update-work-preferences/:id', UserController.updateUserWorkPreferences)
router.post('/create-project/:id', UserController.createProject)
router.put('/update-project/:id', UserController.updateProject)
router.delete('/delete-project/:id', UserController.deleteProject)

router.post('/create-working-histories/:id', UserController.createWorkingHistories)
router.put('/update-working-histories/:id', UserController.updateWorkingHistories)
router.delete('/delete-working-histories/:id', UserController.deleteWorkingHistories)

router.post('/create-educations/:id', UserController.createEducations)
router.put('/update-educations/:id', UserController.updateEducations)
router.delete('/delete-educations/:id', UserController.deleteEducations)

router.post('/create-certifications/:id', UserController.createCertifications)
router.put('/update-certifications/:id', UserController.updateCertifications)
router.delete('/delete-certifications/:id', UserController.deleteCertifications)

router.post('/create-activities/:id', UserController.createActivities)
router.put('/update-activities/:id', UserController.updateActivities)
router.delete('/delete-activities/:id', UserController.deleteActivities)

router.post('/create-language/:id', UserController.createLanguage)
router.put('/update-language/:id', UserController.updateLanguage)
router.delete('/delete-language/:id', UserController.deleteLanguage)

router.post('/create-skills/:id', UserController.createSkills)
router.put('/update-skills/:id', UserController.updateSkills)
router.delete('/delete-skills/:id', UserController.deleteSkills)

router.put('/update-introduce/:id', UserController.updateIntroduce)


module.exports = router