const express = require('express');
const Job = require('../models/Job');
const router = express.Router();


router.post('/create/job', async (req, res) => {
  try {
    const { companyName, jobTitle, description, salary } = req.body;

    const newJob = new Job({ companyName, jobTitle, description, salary });
    await newJob.save();

    res.status(201).send({ message: 'Job created successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error creating job' });
  }``
});


router.get('/get/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.send(jobs);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching jobs' });
  }
});

module.exports = router;