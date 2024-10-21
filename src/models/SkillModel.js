const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: true,
    },
    skillLevel: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
    }
});

const languageSkillSchema = new mongoose.Schema({
    nameLanguage: {
        type: String,
    },
    languageLevel: {
        type: Number,
        enum: [1, 2, 3, 4],
    }
});

module.exports = {
  skillSchema,
  languageSkillSchema
};