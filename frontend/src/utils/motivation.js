// Motivational message pool for habit reminders.
// Keys are "slots" — time-of-day or progress states.
// {pending} and {s} are substituted at render time. {s} → 's' when pending !== 1.

const POOL = {
  morning: [
    "Good morning! Set the tone — knock out one habit before lunch. {pending} waiting.",
    "Fresh day, fresh streak. {pending} habit{s} ready for you.",
    "Champions start early. {pending} small win{s} between you and momentum.",
    "Wake up, stack up. {pending} habit{s} on deck today.",
    "The way you spend your morning shapes your day. {pending} to go.",
  ],
  afternoon: [
    "Halfway there — {pending} habit{s} left. You've got the better half ahead.",
    "Don't let the day drift. {pending} small action{s} away from a clean slate.",
    "Momentum loves the afternoon. Keep stacking — {pending} pending.",
    "One habit now is worth two at midnight. {pending} to go.",
    "You showed up this morning. Show up again — {pending} left.",
  ],
  evening: [
    "Wind-down time, but the day isn't done. {pending} habit{s} still need you.",
    "Future-you will thank present-you. {pending} small thing{s} to finish.",
    "Streaks are built on nights like this. {pending} pending — finish strong.",
    "The hardest yard is the one before bed. {pending} to go.",
    "Don't break the chain. {pending} habit{s} between you and a complete day.",
  ],
  lastCall: [
    "Last call — {pending} habit{s} unticked. Five minutes is all it takes.",
    "Don't let today slip. Just {pending} left to keep your streak alive.",
    "Your streak is on the line. {pending} pending — you can do this.",
    "Almost midnight. {pending} habit{s} between you and a perfect day.",
    "One tap, one habit. {pending} away from done.",
  ],
  allDone: [
    "🔥 All habits done today! Streak intact — go celebrate.",
    "Perfect day. This is what consistency looks like.",
    "Day complete. You're proving that small wins compound.",
    "🎯 Crushed it. Every habit, every day.",
    "Another brick in the wall. Beautifully done.",
  ],
  noneDone: [
    "Big day ahead — {pending} habit{s} ready when you are.",
    "Blank slate, full potential. Tap your first habit to start the day.",
    "Every streak begins with one. {pending} habit{s} waiting.",
  ],
};

const fmt = (template, pending) =>
  template.replace('{pending}', pending).replace('{s}', pending === 1 ? '' : 's');

export const pickSlot = (hour) => {
  if (hour >= 4 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'lastCall';
};

export const pickMessage = (slot, pending) => {
  const arr = POOL[slot] || POOL.evening;
  const pick = arr[Math.floor(Math.random() * arr.length)];
  return fmt(pick, pending);
};

// For the in-app banner on the dashboard:
export const bannerMessage = ({ pending, total, hour }) => {
  if (total === 0) return null;
  if (pending === 0) {
    return {
      tone: 'success',
      title: 'All done for today',
      body: pickMessage('allDone', 0),
    };
  }
  if (pending === total) {
    return {
      tone: 'neutral',
      title: `${pending} habit${pending === 1 ? '' : 's'} to start`,
      body: pickMessage('noneDone', pending),
    };
  }
  return {
    tone: hour >= 21 ? 'urgent' : hour >= 17 ? 'warning' : 'neutral',
    title: `${pending} habit${pending === 1 ? '' : 's'} left today`,
    body: pickMessage(pickSlot(hour), pending),
  };
};

// Default reminder hours
export const DEFAULT_REMINDER_HOURS = [9, 13, 17, 21];
