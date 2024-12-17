const mongoose = require('mongoose');

// Schema for individual team members
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, default: 0 }
});

// Main schema for the team
const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        trim: true, // Trims whitespace around team name
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true, // Ensures event ID is provided
    },
    corporateId: {
        type: String,
        required: true, // Ensures a corporate ID is provided for anonymity
    },
    members: [memberSchema], // Embeds the team member schema
    totalScore: {
        type: Number,
        default: 0, // Default total score is 0
    },
    evaluated: {
        type: Boolean,
        default: false, // Evaluated status of the team
    },
});

// Ensure unique team names per event using compound index on `teamName` and `eventId`
teamSchema.index({ teamName: 1, eventId: 1 }, { unique: true });

// Create and export the Team model
const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

module.exports = Team;


