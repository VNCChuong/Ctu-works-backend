const express = require("express");
const router = express.Router()
const JobPostController = require('../controllers/JobPostController');

router.post('/create',  JobPostController.createJobPost)
router.put('/update/:id', JobPostController.updateJobPost)
router.delete('/delete/:id',  JobPostController.deleteJobPost)

router.get('/get-all-jobpost', JobPostController.getAllJobPost)
router.get('/get-all-jobpost-admin', JobPostController.getAllJobPostAdmin)

router.get('/get-my-jobpost/:id', JobPostController.getMyJobPost)

router.get('/get-details-jobpost/:id', JobPostController.getDetailsJobPost)

router.put('/cancel-jobpost/:id', JobPostController.cancelJobPost)

router.post('/delete-many-jobpost',  JobPostController.deleteManyJobPost)
router.put('/approve/:id',JobPostController.approvalJobpost)
router.put('/reject/:id',JobPostController.rejectJobpost)
module.exports = router