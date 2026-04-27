import { useMemo } from 'react';
import { Sparkles, AlertTriangle, PartyPopper, Flame } from 'lucide-react';
import { bannerMessage } from '../utils/motivation.js';

const TONE_STYLES = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: PartyPopper,
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  neutral: {
    bg: 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30',
    text: 'text-brand-800 dark:text-brand-100',
    icon: Sparkles,
    iconClass: 'text-brand-600 dark:text-brand-400',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
    text: 'text-amber-800 dark:text-amber-200',
    icon: Flame,
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  urgent: {
    bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30',
    text: 'text-rose-800 dark:text-rose-200',
    icon: AlertTriangle,
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
};

export default function MotivationBanner({ pending, total }) {
  const msg = useMemo(
    () => bannerMessage({ pending, total, hour: new Date().getHours() }),
    [pending, total]
  );
  if (!msg) return null;

  const tone = TONE_STYLES[msg.tone] || TONE_STYLES.neutral;
  const Icon = tone.icon;

  return (
    <div className={`rounded-2xl border ${tone.bg} p-4 flex items-start gap-3`}>
      <div className={`shrink-0 w-9 h-9 rounded-xl bg-white/60 dark:bg-black/20 grid place-items-center ${tone.iconClass}`}>
        <Icon size={18} />
      </div>
      <div className={`flex-1 min-w-0 ${tone.text}`}>
        <div className="font-semibold text-sm">{msg.title}</div>
        <p className="text-sm opacity-90 mt-0.5">{msg.body}</p>
      </div>
    </div>
  );
}
