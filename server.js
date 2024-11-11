const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static HTML file
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Register the user with a username
  socket.on('register', (username) => {
    socket.username = username;
    console.log(`${username} registered.`);
  });

  // Handle call initiation
  socket.on('call_user', ({ fromUser, toUser, videoLink }) => {
    console.log(`Call from ${fromUser} to ${toUser} with video: ${videoLink}`);
    // Notify the recipient of the incoming call
    socket.broadcast.emit('incoming_call', { fromUser, toUser, videoLink });
  });

  // Handle call acceptance
  socket.on('accept_call', (data) => {
    io.emit('call_accepted', data);
  });

  // Handle call decline
  socket.on('decline_call', (data) => {
    io.emit('call_declined', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
