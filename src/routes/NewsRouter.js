const express = require("express");
const router = express.Router()
const NewsController = require('../controllers/NewsController');

router.post('/create',  NewsController.createNews)

router.post('/update-news/:id',  NewsController.updateNews)

router.delete('/delete/:id',  NewsController.deleteNews)

router.get('/get-detail-news/:id', NewsController.getDetailNews)

router.get("/get-all-news", NewsController.getAllNews);
module.exports = router