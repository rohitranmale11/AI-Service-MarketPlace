export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-blue-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      {label}
    </div>
  );
}
