// Import required libraries
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize the Express app and create an HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server);

// Store connected users
const users = {};

// Serve static files (optional)
app.use(express.static(__dirname + '/public'));

// Set up a basic route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user registration
  socket.on('register', (username) => {
    users[socket.id] = username;
    io.emit('user-list', Object.values(users));
  });

  // Handle incoming messages
  socket.on('chat-message', (message) => {
    io.emit('chat-message', {
      username: users[socket.id],
      message: message,
    });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-list', Object.values(users));
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
