export const todayStr = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60000).toISOString().slice(0, 10);
};

export const lastNDays = (n) => {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const tz = d.getTimezoneOffset();
    out.push(new Date(d.getTime() - tz * 60000).toISOString().slice(0, 10));
  }
  return out;
};

export const formatShort = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
