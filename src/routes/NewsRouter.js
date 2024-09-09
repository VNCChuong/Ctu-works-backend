const express = require("express");
const router = express.Router()
const NewsController = require('../controllers/NewsController');

router.post('/create',  NewsController.createNews)

router.put('/update/:id',  NewsController.deleteNews)

router.delete('/delete/:id',  NewsController.deleteNews)

router.get('/get-detail-news/:id', NewsController.getDetailNews)

module.exports = router