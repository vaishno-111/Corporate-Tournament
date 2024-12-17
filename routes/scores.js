const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Make `io` available to the routes
app.set('io', io);

// Other middleware and routes setup

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
