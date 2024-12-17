const express = require('express');
const router = express.Router();
const Event = require('../models/event'); // Ensure this model exists

// Create a new event
router.post('/create', async (req, res) => {
  const { eventName, eventDate, categories } = req.body;
  const event = new Event({ eventName, eventDate, categories });
  
  try {
    await event.save();
    res.redirect('/admin'); // Redirect after creating
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send('Server Error');
  }
});

// Get all events for the registration page
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events); // Change this based on how you want to display events
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router; // Ensure this line is present
