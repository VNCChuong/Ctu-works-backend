const express = require("express");
const router = express.Router()
const LocationCompany = require('../controllers/LocationCompanyController');

router.post('/create', LocationCompany.create)

router.put('/update/:id', LocationCompany.update)

router.delete('/delete/:id', LocationCompany.deleteLocation)

router.post('/get-location-company/:id', LocationCompany.get)

module.exports = router