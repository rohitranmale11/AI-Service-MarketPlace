export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        className={`min-h-36 w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 ${error ? 'border-rose-300 bg-rose-50/70' : 'border-slate-200'} ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block text-xs font-medium text-rose-500">{error}</span>}
    </label>
  );
}
