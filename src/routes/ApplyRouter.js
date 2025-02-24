const express = require("express");
const router = express.Router();
const ApplyController = require("../controllers/ApplyController");

router.post("/create", ApplyController.createApply);

router.put("/update/:id", ApplyController.updateApply);

router.delete("/delete/:id", ApplyController.deleteApply);

router.post("/get-my-apply/:id", ApplyController.getMyApply);

router.get("/apply-count/:jobPostId", ApplyController.getApplyCountByJob);
module.exports = router;