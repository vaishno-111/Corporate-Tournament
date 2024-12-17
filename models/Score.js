// models/Score.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    rank: {
        type: String,
        enum: ['1st', '2nd', '3rd'],
        required: true
    },
    points: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Score', scoreSchema);
