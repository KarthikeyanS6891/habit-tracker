export default function StatsCard({ label, value, icon: Icon, accent = 'text-brand-600' }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 grid place-items-center ${accent}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
