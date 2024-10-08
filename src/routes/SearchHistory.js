const express = require("express");
const router = express.Router()
const SearchHistoryController = require('../controllers/SearchHistoryController');

router.post('/create',  SearchHistoryController.createSearchHistory)


router.get('/get-my-savejob/:id', SearchHistoryController.getMySearchHistory)

module.exports = router