const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require("path");
const socketIo = require('socket.io');
const ejsMate = require("ejs-mate");
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const judgeRoutes = require('./routes/judge');
const registerRoutes = require('./routes/register');
const Event = require('./models/event'); // Import the Event model
const Team = require('./models/team');   // Import the Team model
const generateCertificateRouter = require('./routes/generateCertificate');

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Socket.IO setup

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bitnbuild', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up EJS with ejs-mate
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));
app.use(express.json()); // Middleware for JSON requests
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/admin', adminRoutes(io));  // Pass io instance to admin route
app.use('/judge', judgeRoutes(io));  // Pass io instance to judge route
app.use('/register', registerRoutes);
app.use('/generate-certificate', generateCertificateRouter);


// Home route
app.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.render('index', { events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Server Error');
    }
});

// Add the /update-score route for real-time leaderboard updates
app.post('/update-score', async (req, res) => {
    const { teamId, newScore } = req.body;

    try {
        // Update the team's score in the database
        await Team.updateOne({ _id: teamId }, { $set: { totalScore: newScore } });

        // Fetch updated leaderboard
        const updatedLeaderboard = await Team.find().sort({ totalScore: -1 });

        // Emit the updated leaderboard to all connected clients
        io.emit('updateLeaderboard', updatedLeaderboard);

        res.json({ success: true, message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).send('Server Error');
    }
});

// Leaderboard route for all events
app.get('/leaderboard/all', async (req, res) => {
    try {
        const events = await Event.find();
        const leaderboardData = await Promise.all(events.map(async (event) => {
            const teams = await Team.find({ eventId: event._id }).sort({ totalScore: -1 });
            return { event, teams };
        }));

        res.render('allLeaderboard', { leaderboardData });
    } catch (error) {
        console.error('Error fetching all events leaderboard:', error);
        res.status(500).send('Server Error');
    }
});

// Leaderboard for a specific event
app.get('/leaderboard/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');

        const teams = await Team.find({ eventId })
            .sort({ totalScore: -1 })
            .select('teamName totalScore');

        res.render('leaderboard', { eventName: event.name, teams });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send('Server Error');
    }
});

// Socket.IO real-time communication
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-registration', (data) => {
        io.emit('update-registrations', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
