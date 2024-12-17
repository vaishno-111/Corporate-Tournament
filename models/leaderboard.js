const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    positions: [
        {
            teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
            rank: { type: Number },
        },
    ],
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
