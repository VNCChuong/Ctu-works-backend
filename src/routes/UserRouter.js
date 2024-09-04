const express = require("express")
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");


router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)
router.post('/log-out', UserController.logoutUser)

router.put('/change-password',UserController.changePassword)
router.put('/update-user/:id', UserController.updateUser)
router.put('/update-seek-job-mode/:id', UserController.updateSeekJob)

router.delete('/delete-user/:id', UserController.deleteUser)

router.get('/getAll', UserController.getAllUser)
router.get('/get-details/:id', UserController.getDetailsUser)
router.post('/refresh-token', UserController.refreshToken)
router.post('/delete-many', UserController.deleteMany)


module.exports = router