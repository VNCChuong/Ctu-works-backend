const express = require("express")
const router = express.Router();
const RecruiterController = require('../controllers/RecruiterController');

router.post('/sign-up-recruiter', RecruiterController.createRecruiter)

router.post('/sign-in-recruiter', RecruiterController.loginRecruiter)
router.post('/log-out-recruiter', RecruiterController.logoutRecruiter)

router.put('/change-password-recruiter', RecruiterController.changePasswordRecruiter)
router.put('/update-recruiter/:id', RecruiterController.updateRecruiter)

router.delete('/delete-recruiter/:id', RecruiterController.deleteRecruiter)

router.get('/getAll-recruiter', RecruiterController.getAllRecruiter)
router.get('/get-details-recruiter/:id', RecruiterController.getDetailsRecruiter)

router.post('/refresh-token', RecruiterController.refreshToken)
router.post('/delete-many-recruiter', RecruiterController.deleteManyRecruiter)

router.post('/create-location/:id', RecruiterController.createLocation)
router.put('/update-location/:id', RecruiterController.updateLocation)
router.delete('/delete-location/:id', RecruiterController.deleteLocation)

router.get("/get-all-company", RecruiterController.getAllRecruiterCompany)
module.exports = router