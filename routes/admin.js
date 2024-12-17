// routes/admin.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { v4: uuidv4 } = require('uuid'); // Import uuid

// Define a function that takes `io` as a parameter
module.exports = (io) => {
  // Admin: Render event creation page
  router.get('/', (req, res) => {
    console.log('Admin route accessed'); // Debugging line
    res.render('admin'); // Ensure this view exists
  });

  // Admin: Create a new event
  router.post('/createEvent', async (req, res) => {
    const { name, category, date } = req.body; // Include date here
    try {
      const corporateCode = uuidv4(); // Generate unique corporate ID
      const newEvent = new Event({ name, category, corporateCode, date }); // Include date
      await newEvent.save();

      // Emit event to all connected clients
      io.emit('newEvent', { name, category, corporateCode, date }); // Emit date too

      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Team leader: Render event registration page
  router.get('/register', async (req, res) => {
    try {
      const events = await Event.find();
      res.render('register', { events }); // Ensure this view exists
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Team leader: Register for an event using a corporate code
  router.post('/registerEvent', async (req, res) => {
    const { eventId, corporateCode } = req.body;
    try {
      const event = await Event.findById(eventId);
      if (event && event.corporateCode === corporateCode) {
        // You can store the registration with the corporate ID here if needed
        res.send('Registration Successful');
      } else {
        res.send('Invalid Corporate Code');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  return router; // Return the router
};
