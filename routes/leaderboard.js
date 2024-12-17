const express = require('express');
const router = express.Router();
const Team = require('../models/team');

// Get leaderboard for a specific event
router.get('/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const teams = await Team.find({ eventId })
            .sort({ totalScore: -1 }) // Sort teams by totalScore in descending order
            .select('teamName totalScore');

        res.json(teams);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
