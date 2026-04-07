# Study App

A real-time collaborative study application with room management, chat, and study tracking.

## Features

- Create and join study rooms with unique IDs
- Real-time online/offline status tracking
- Study session tracking with weekly statistics
- Dark/Light mode toggle
- Real-time chat functionality
- User authentication
- Friend system
- Profile pages with bar graph statistics

## Tech Stack

- Frontend: React + Vite, Socket.IO Client, Chart.js
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB

## Deployment

### Recommended: Deploy Frontend and Backend Separately

This app uses WebSockets (Socket.IO) which Vercel doesn't support well for backends. Here's the best approach:

#### Step 1: Deploy Backend to Render (Free)

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: study-app-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Any random secure string
   - `PORT`: 5001
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://study-app-backend.onrender.com`)

#### Step 2: Deploy Frontend to Vercel (Free)

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your Render backend URL (from Step 1)
   - `VITE_SOCKET_URL`: Your Render backend URL (from Step 1)
6. Click "Deploy"

#### Step 3: Update Backend CORS

After deploying frontend, update `server/server.js` CORS to allow your Vercel URL:

```javascript
const io = new Server(httpServer, {
  cors: { 
    origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
    credentials: true 
  }
});

app.use(cors({ 
  origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
  credentials: true 
}));
```

### Alternative: Deploy Everything on Render

1. Deploy as a single web service on Render
2. Build command: `npm install && cd server && npm install && cd ../client && npm install && npm run build`
3. Start command: `cd server && node server.js`
4. Serve static files from `client/dist` in your Express app

### MongoDB Setup

Use MongoDB Atlas (free tier):
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to your environment variables

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Local Development

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

Run both together (from root):
```bash
npm run dev
```

Or run separately:

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
- Backend: http://localhost:5001

## Usage

1. Register a new account or login
2. Create a new study room or join existing one with Room ID
3. Start studying to track your time
4. Chat with other members in real-time
5. Add friends and view their stats
6. View your stats and progress on your profile
7. Toggle between dark and light modes

## Notes

- Audio/video features can be added using WebRTC libraries like PeerJS or simple-peer
- File upload for chat can be implemented using multer on the backend
- Make sure MongoDB is running before starting the server
- For production, update all localhost URLs to your deployed URLs

## License

MIT
