import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import * as habitsApi from '../api/habits.js';
import { todayStr } from '../utils/date.js';
import { pickMessage, pickSlot, DEFAULT_REMINDER_HOURS } from '../utils/motivation.js';

const MAX_TIMEOUT = 2147483647; // ~24.8 days, JS max

const msUntilNext = (hour) => {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return Math.min(target.getTime() - now.getTime(), MAX_TIMEOUT);
};

const fireReminder = async (hour) => {
  try {
    const habits = await habitsApi.listHabits();
    if (!habits.length) return;

    const today = todayStr();
    const pending = habits.filter((h) => !h.completions.some((c) => c.date === today));
    if (pending.length === 0) return; // don't pester when they're already done

    const slot = pickSlot(hour);
    const body = pickMessage(slot, pending.length);

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('Habit Tracker', {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: `habit-reminder-${slot}`, // dedupe within a slot
      });
    }
    toast(body, { icon: '⏰', duration: 7000 });
  } catch (err) {
    // Silent — reminders shouldn't disrupt the app
  }
};

/**
 * Schedules motivational reminders at fixed local hours.
 * Self-reschedules so it works across days without remount.
 */
export function useReminders({ enabled = true, hours = DEFAULT_REMINDER_HOURS } = {}) {
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!enabled) return;

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    const schedule = (hour) => {
      const ms = msUntilNext(hour);
      const id = setTimeout(async () => {
        await fireReminder(hour);
        schedule(hour); // reschedule for tomorrow
      }, ms);
      timers.current.push(id);
    };

    hours.forEach(schedule);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [enabled, hours.join(',')]); // resubscribe if list changes
}
