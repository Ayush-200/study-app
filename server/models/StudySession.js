import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }
});

export default mongoose.model('StudySession', studySessionSchema);
