const express = require("express");
const router = express.Router()
const Ai = require('../Ai/SearchHistory');

router.post('/recommend-jobs',  Ai.searchHistory)


module.exports = router