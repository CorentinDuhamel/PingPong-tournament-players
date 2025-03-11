const express = require('express');
const router = express.Router();
const { getParticipationData } = require('../services/participationService');

router.get('/', async (req, res) => {
  try {
    const data = await getParticipationData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching participation data:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
