export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-indigo-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      {label}
    </div>
  );
}
