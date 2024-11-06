const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/CompanyController");

router.get("/top-companies", CompanyController.getTopCompanies);
module.exports = router;
