export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className={`w-full rounded-2xl border bg-white/85 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${error ? 'border-rose-300 bg-rose-50/70' : 'border-slate-200'} ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block text-xs font-medium text-rose-500">{error}</span>}
    </label>
  );
}
