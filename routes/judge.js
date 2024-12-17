// routes/judge.js
const express = require('express');
const router = express.Router();
const Team = require('../models/team');

module.exports = (io) => {
    // Render the judge's dashboard
    router.get('/', async (req, res) => {
        try {
            const teams = await Team.find().populate('members');
            res.render('judge', { teams });
        } catch (error) {
            console.error('Error fetching teams:', error);
            res.status(500).send('Server Error');
        }
    });

    // Handle the score submission
    router.post('/score', async (req, res) => {
        try {
            const { teamId, scores } = req.body;
            const team = await Team.findById(teamId).populate('members');

            // Update team scores and set evaluated to true
            team.members.forEach(member => {
                if (scores[member._id]) {
                    member.score = scores[member._id];  // Assign score from the request
                }
            });

            // Recalculate the total score
            team.totalScore = team.members.reduce((sum, member) => sum + (member.score || 0), 0);
            team.evaluated = true;  // Mark the team as evaluated

            // Save the updated team document
            await team.save();

            // Emit the event to all connected clients
            io.emit('teamEvaluated', teamId);

            res.redirect('/judge');  // Redirect after successful submission
        } catch (error) {
            console.error('Error logging scores:', error);
            res.status(500).send('Server Error');
        }
    });

    return router;
};
