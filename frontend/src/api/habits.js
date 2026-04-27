import { api } from './client.js';

export const listHabits = () => api.get('/habits').then((r) => r.data.habits);
export const createHabit = (data) => api.post('/habits', data).then((r) => r.data.habit);
export const updateHabit = (id, data) => api.patch(`/habits/${id}`, data).then((r) => r.data.habit);
export const deleteHabit = (id) => api.delete(`/habits/${id}`).then((r) => r.data);
export const toggleHabit = (id, date) =>
  api.post(`/habits/${id}/toggle`, date ? { date } : {}).then((r) => r.data);
export const getStats = (days = 30) =>
  api.get(`/habits/stats`, { params: { days } }).then((r) => r.data);
export const getLeaderboard = () =>
  api.get('/users/leaderboard').then((r) => r.data.leaderboard);
export const getProgress = () => api.get('/users/progress').then((r) => r.data.progress);
export const updateProfile = (data) => api.patch('/users/me', data).then((r) => r.data.user);
