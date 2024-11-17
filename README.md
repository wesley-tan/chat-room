# Chat Room Application

A real-time chat room application with authentication built using React, Node.js, Socket.IO, and MongoDB.

## Features

- User authentication (login/signup)
- Real-time messaging
- User presence indicators
- Message history
- Active users list

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd chat-room
```

### 2. Set up the Server

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the server directory with your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
```

### 3. Set up the Client

Open a new terminal, navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

### 4. Start the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the client:
```bash
cd client
npm start
```

The client will run on `http://localhost:3000` and the server on `http://localhost:5001`.

## Project Structure

The project follows a client-server architecture:

### Client
- React frontend with Socket.IO client
- Components for Login, ChatRoom, MessageList, and UserList
- Real-time message updates
- User authentication UI

### Server
- Node.js/Express backend
- Socket.IO for real-time communication
- MongoDB for data persistence
- User authentication
- Message history management

## Usage

1. Open `http://localhost:3000` in your browser
2. Create a new account or login with existing credentials
3. Start chatting!

## API Events

### Socket Events
- `join`: User login
- `create-account`: New user registration
- `send-message`: Send a new message
- `new-message`: Receive a new message
- `user-list`: Get active users list
- `previous-messages`: Get chat history
- `logout`: User logout

## License

This project is licensed under the MIT License - see the LICENSE file for details.
