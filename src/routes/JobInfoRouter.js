const express = require("express");
const router = express.Router();
const JobInfo = require("../controllers/JobInfoController");

router.post("/create", JobInfo.createJobInfo);

router.put("/update/:id", JobInfo.updateJobInfo);

router.delete("/delete/:id", JobInfo.deleteJobInfo);

router.post("/get-job-info/:id", JobInfo.getJobInfo);

router.get("/related-jobs/:id", JobInfo.getRelatedJobs);

router.get("/job-industry-counts", JobInfo.getJobIndustryCounts);
module.exports = router;
