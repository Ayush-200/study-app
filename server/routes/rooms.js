import express from 'express';
import Room from '../models/Room.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = new Room({ name, roomId, createdBy: req.userId, members: [req.userId] });
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:roomId', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Room.deleteOne({ roomId: req.params.roomId });
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/my-rooms', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.userId }).populate('createdBy', 'username');
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
