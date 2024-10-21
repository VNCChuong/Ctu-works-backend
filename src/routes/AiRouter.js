const express = require("express")
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')

const Ai = require('../Ai/SearchHistory');
const createJob = require('../Ai/createJob');
router.use(bodyParser.urlencoded({ extended: true }))
// router.use(express.static(path.resole(__dirname, '../uploads')))
global._basedir = __dirname

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, _basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage })

router.post('/recommend-jobs', Ai.searchHistory)
router.post('/api/upload', upload.single('file'), createJob.createJobAi)

module.exports = router