# Study App

A real-time collaborative study application with room management, chat, and study tracking.

## Features

- Create and join study rooms with unique IDs
- Real-time online/offline status tracking
- Study session tracking with weekly statistics
- Dark/Light mode toggle
- Real-time chat functionality
- User authentication

## Tech Stack

- Frontend: React, Socket.IO Client
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (running locally or connection string)

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
cd ..
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

4. Configure MongoDB:
   - Edit `server/.env` and update `MONGODB_URI` if needed
   - Default: `mongodb://localhost:27017/study-app`

### Running the App

Option 1 - Run both together (from root):
```bash
npm run dev
```

Option 2 - Run separately:

Terminal 1 (Server):
```bash
npm run server
```

Terminal 2 (Client):
```bash
npm run client
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Register a new account or login
2. Create a new study room or join existing one with Room ID
3. Start studying to track your time
4. Chat with other members in real-time
5. View your stats and other members' progress
6. Toggle between dark and light modes

## Notes

- Audio/video features can be added using WebRTC libraries like PeerJS or simple-peer
- File upload for chat can be implemented using multer on the backend
- Make sure MongoDB is running before starting the server
