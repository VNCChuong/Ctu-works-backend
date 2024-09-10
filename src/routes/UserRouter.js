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
router.post('/uploadfile',upload.single('file'), UserController.uploadfile)
module.exports = router