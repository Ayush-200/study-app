import express from 'express';
import Friend from '../models/Friend.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-request', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const friend = await User.findOne({ email });
    if (!friend) return res.status(404).json({ error: 'User not found' });
    if (friend._id.toString() === req.userId) {
      return res.status(400).json({ error: 'Cannot add yourself' });
    }

    const existing = await Friend.findOne({
      $or: [
        { userId: req.userId, friendId: friend._id },
        { userId: friend._id, friendId: req.userId }
      ]
    });

    if (existing) return res.status(400).json({ error: 'Request already exists' });

    const friendRequest = new Friend({ userId: req.userId, friendId: friend._id });
    await friendRequest.save();
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/accept/:requestId', authMiddleware, async (req, res) => {
  try {
    const request = await Friend.findById(req.params.requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.friendId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    request.status = 'accepted';
    await request.save();
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/list', authMiddleware, async (req, res) => {
  try {
    const friends = await Friend.find({
      $or: [{ userId: req.userId }, { friendId: req.userId }],
      status: 'accepted'
    }).populate('userId friendId', 'username email');

    const friendList = friends.map(f => {
      const friend = f.userId._id.toString() === req.userId ? f.friendId : f.userId;
      return { id: friend._id, username: friend.username, email: friend.email };
    });

    res.json(friendList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await Friend.find({
      friendId: req.userId,
      status: 'pending'
    }).populate('userId', 'username email');
    res.json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
