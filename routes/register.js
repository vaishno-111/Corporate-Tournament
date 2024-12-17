const express = require('express');
const router = express.Router();
const Team = require('../models/team');  // Import your Team model
const Event = require('../models/event'); // Import your Event model
const { v4: uuidv4 } = require('uuid');

// Registration page
router.get('/', async (req, res) => {
  const events = await Event.find({});
  res.render('register', { events });
});

// Registration logic
router.post('/register', async (req, res) => {
  const { teamName, eventId, memberNames } = req.body; // Get team name, event ID, and member names from request body
  const corporateId = uuidv4(); // Generate a unique corporate ID for the team

  try {
    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Generate members with unique corporate IDs
    const members = memberNames.map(name => ({
      name,
      corporateId: uuidv4(), // Generate a unique corporate ID for each member
    }));

    // Create the new team
    const newTeam = new Team({
      teamName,
      eventId,
      corporateId,
      members,
    });

    // Save the team to the database
    try {
      await newTeam.save();
    } catch (error) {
      // Check for duplicate key error (unique index violation)
      if (error.code === 11000) { // Duplicate key error code
        return res.status(400).send('A team with this name already exists for this event');
      }
      return res.status(500).send('Server Error');
    }

    // Add the team to the event
    event.teams.push(newTeam._id);
    await event.save();

    // Redirect to homepage after successful registration
    res.redirect('/'); // Redirect to the homepage

  } catch (error) {
    console.error('Error during team registration:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
