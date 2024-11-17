const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const User = require('./models/User');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  transports: ['websocket', 'polling']
});

// Connect to MongoDB with error handling
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('New client connected');

  // Handle user join (login)
  socket.on('join', async ({ username, password }) => {
    console.log('Attempting to join:', username);
    
    try {
      // Check if username exists
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        socket.emit('error', 'Username not found. Please create an account.');
        return;
      }

      // Verify password
      const isValidPassword = await existingUser.comparePassword(password);
      if (!isValidPassword) {
        socket.emit('error', 'Invalid password');
        return;
      }

      // Update user's socket ID
      existingUser.socketId = socket.id;
      await existingUser.save();

      socket.emit('login-success');
      
      // Send previous messages
      const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
      socket.emit('previous-messages', messages);

      // Update all clients with new user list
      const users = await User.find({}, 'username lastActive');
      io.emit('user-list', users);
    } catch (error) {
      console.error('Login error:', error);
      socket.emit('error', 'An error occurred during login');
    }
  });

  // Handle create account
  socket.on('create-account', async ({ username, password }) => {
    console.log('Attempting to create account:', username);
    
    if (!username || !password) {
      console.log('Missing username or password');
      socket.emit('error', 'Username and password are required');
      return;
    }

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log('Username already exists:', username);
        socket.emit('error', 'Username already taken');
        return;
      }

      const user = new User({
        username,
        password,
        socketId: socket.id
      });
      
      await user.save();
      console.log('Account created successfully:', username);
      socket.emit('login-success');
      
      const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
      socket.emit('previous-messages', messages);

      const users = await User.find({}, 'username lastActive');
      io.emit('user-list', users);
    } catch (error) {
      console.error('Account creation error:', error);
      socket.emit('error', `Error creating account: ${error.message}`);
    }
  });

  // Handle new message
  socket.on('send-message', async ({ username, content }) => {
    try {
      const message = new Message({
        username,
        content,
        timestamp: new Date()
      });
      await message.save();
      io.emit('new-message', message);
    } catch (error) {
      console.error('Message sending error:', error);
      socket.emit('error', 'Error sending message');
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('Client disconnected');
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.lastActive = new Date();
        await user.save();
        const users = await User.find({}, 'username lastActive');
        io.emit('user-list', users);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });

  // Add this inside the io.on('connection') handler
  socket.on('logout', async () => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.socketId = null;
        user.lastActive = new Date();
        await user.save();
        const users = await User.find({}, 'username lastActive');
        io.emit('user-list', users);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is attempting to start on port ${PORT}`);
});

// Add error handlers
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
}); 