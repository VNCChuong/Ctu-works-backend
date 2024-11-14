const JobPost = require('../models/JobPostModel');
const User = require('../models/UserModel');
const express = require('express');
const mongoose = require('mongoose');
const nlp = require('node-nlp');
function extractKeywords(text) {

  return nlp.extractKeywords(text);
}
function calculateSimilarity(keywords1, keywords2) {

  keywords1 = Array.isArray(keywords1) ? keywords1 : [];
  keywords2 = Array.isArray(keywords2) ? keywords2 : [];

  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}
const searchHistory = async (req, res) => {

  try {
    const userId = "66eaf4ae0d6305f1cbd02c37"
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Candidate not found');
    }
    let userKeywords = user.skills;
    user.skills.forEach(exp => {
      userKeywords = userKeywords.concat(() => extractKeywords(exp.skillName));
    });

    const candidateSkillNames = userKeywords.map(skill => skill.skillName)

    const jobs = await JobPost.find();
    const recommendedJobs = jobs
      .map(job => {

        let jobKeywords = [...job.jobInformation.keywords];

        const similarityScore = calculateSimilarity(candidateSkillNames, jobKeywords);

        // console.log(similarityScore)
        return { job, similarityScore };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 10)
      .map(item => item.job);

    res.json(recommendedJobs);
  } catch (err) {
    console.error('Error searching jobs:', err);
    res.status(500).send('Server Error');
  }

};

module.exports = {
  searchHistory
};