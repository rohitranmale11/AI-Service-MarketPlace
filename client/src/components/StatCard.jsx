export default function StatCard({ label, value, trend, tone = 'from-indigo-500 to-blue-500' }) {
  return (
    <div className="glass rounded-2xl p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-extrabold text-slate-950">{value}</p>
        </div>
        {trend && (
          <div className={`rounded-2xl bg-gradient-to-br ${tone} px-3 py-2 text-sm font-bold text-white`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
