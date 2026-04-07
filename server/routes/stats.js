import express from 'express';
import StudySession from '../models/StudySession.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/start-session', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.body;
    const session = new StudySession({ userId: req.userId, roomId, startTime: new Date() });
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/end-session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000 / 60);
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sessions = await StudySession.find({
      userId: req.params.userId,
      startTime: { $gte: sevenDaysAgo }
    });
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Group by day for bar chart
    const dailyStats = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = 0;
    }
    
    sessions.forEach(session => {
      const dateKey = session.startTime.toISOString().split('T')[0];
      if (dailyStats[dateKey] !== undefined) {
        dailyStats[dateKey] += session.duration;
      }
    });
    
    res.json({ 
      sessions, 
      totalMinutes, 
      totalHours: (totalMinutes / 60).toFixed(2),
      dailyStats 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/room/:roomId', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allSessions = await StudySession.find({ roomId: req.params.roomId });
    const todaySessions = await StudySession.find({
      roomId: req.params.roomId,
      startTime: { $gte: today }
    });
    
    const totalMinutesToday = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    
    res.json({
      totalSessions: allSessions.length,
      hoursToday: (totalMinutesToday / 60).toFixed(2)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
