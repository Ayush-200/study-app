import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import statsRoutes from './routes/stats.js';
import friendRoutes from './routes/friends.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000', credentials: true }
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/friends', friendRoutes);

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('user-online', ({ userId, roomId }) => {
    onlineUsers.set(userId, { socketId: socket.id, roomId });
    io.to(roomId).emit('user-status', { userId, online: true });
  });

  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    onlineUsers.set(userId, { socketId: socket.id, roomId });
    io.to(roomId).emit('user-joined', { userId });
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    onlineUsers.delete(userId);
    io.to(roomId).emit('user-left', { userId });
  });

  socket.on('chat-message', ({ roomId, message, userId, username }) => {
    io.to(roomId).emit('chat-message', { message, userId, username, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    for (const [userId, data] of onlineUsers.entries()) {
      if (data.socketId === socket.id) {
        onlineUsers.delete(userId);
        io.to(data.roomId).emit('user-status', { userId, online: false });
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
