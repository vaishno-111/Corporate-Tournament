const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }] // Optional: Add this if you want to keep track of teams
    // Add any other fields you need
});

// Check if the model is already registered
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;


