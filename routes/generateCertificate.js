const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Team = require('../models/team');
const Event = require('../models/event');
const Leaderboard = require('../models/leaderboard');

// Render generate certificate page with events
router.get('/', async (req, res) => {
    try {
        // Fetch all events from the database
        const events = await Event.find();

        // Pass the events to the EJS template
        res.render('generate-certificate', { events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Server Error');
    }
});

// Generate PDF for certificate download
router.get('/generate-pdf', async (req, res) => {
    const { teamName, eventId } = req.query;

    if (!teamName || !eventId) {
        return res.status(400).send('Team name and event ID are required');
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send('Event not found');
        }

        const team = await Team.findOne({ teamName, eventId });
        if (!team) {
            return res.status(404).send('Team not found');
        }

        const leaderboard = await Leaderboard.findOne({ eventId });
        let position = 'Not ranked';

        if (leaderboard) {
            const rank = leaderboard.positions.find(pos => pos.teamId.toString() === team._id.toString());
            position = rank ? rank.rank : position;
        }

        // Create PDF with pdfkit
        const doc = new PDFDocument();

        // Set the response type to PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${team.teamName}-certificate.pdf`);
        
        // Pipe the output to the response
        doc.pipe(res);

        // Title
        doc.fontSize(20).text('Certificate of Participation', { align: 'center' }).moveDown(1);

        // Team Name and Event Name
        doc.fontSize(14).text(`This is to certify that`, { align: 'center' }).moveDown(0.5);
        doc.fontSize(16).text(team.teamName, { align: 'center' }).moveDown(0.5);
        doc.text(`has participated in the event`, { align: 'center' }).moveDown(0.5);
        doc.fontSize(14).text(`${event.name} - ${event.category}`, { align: 'center' }).moveDown(1);

        // Position
        doc.fontSize(12).text(`Position: ${position}`, { align: 'center' }).moveDown(1);

        // Team Members
        doc.text('Team Members:', { align: 'left' }).moveDown(0.5);
        team.members.forEach(member => {
            doc.text(`- ${member.name}`, { align: 'left' });
        });

        // Finalize the PDF
        doc.end();

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
