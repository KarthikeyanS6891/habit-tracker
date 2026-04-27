import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD (user-local date)
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 280, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: '#6366f1' },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    targetPerWeek: { type: Number, default: 7, min: 1, max: 7 },
    archived: { type: Boolean, default: false },
    completions: { type: [completionSchema], default: [] },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedAt: { type: String, default: null },
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, archived: 1 });

export default mongoose.model('Habit', habitSchema);
