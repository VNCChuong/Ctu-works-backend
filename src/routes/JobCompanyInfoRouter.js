const express = require("express");
const router = express.Router()
const JobCompanyInfo = require('../controllers/JobCompanyInfoController');

router.post('/create', JobCompanyInfo.createJobCompanyInfo)

router.put('/update/:id', JobCompanyInfo.updateJobCompanyInfo)

router.delete('/delete/:id', JobCompanyInfo.deleteJobCompanyInfo)

router.post('/get-job-company-info/:id', JobCompanyInfo.getJobCompanyInfo)

module.exports = router