const { spawn } = require('child_process');
const User = require('../models/UserModel');
const JobPost = require('../models/JobPostModel');

async function runPythonScript(text, keywords) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['src/Ai/your_spacy_script.py', text, JSON.stringify(keywords)]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(output));
      } else {
        reject(`Python process exited with code ${code}`);
      }
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data.toString()}`);
    });
  });
}

async function searchHistory(req, res) {
  try {
    const userId = '66eaf4ae0d6305f1cbd02c37';
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Candidate not found');
    }

    const userKeywords = user.skills.map(skill => skill.skillName); 
    // console.log(userKeywords)
    const jobs = await JobPost.find();
    const recommendedJobs = await Promise.all(
      jobs.map(async (job) => {
        const jobKeywords = job.jobInformation.keywords;
        const similarityScore = await runPythonScript(userKeywords, jobKeywords);
        return { job, similarityScore };
      })
    );

    recommendedJobs.sort((a, b) => b.similarityScore - a.similarityScore);
    const top10Jobs = recommendedJobs.slice(0, 1).map(item => item.job);
    // console.log(top10Jobs) 
    res.json(top10Jobs);
  } catch (err) {
    console.error('Error searching jobs:', err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  searchHistory
};