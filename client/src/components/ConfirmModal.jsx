import Button from './Button';

export default function ConfirmModal({ open, title, description, confirmLabel = 'Confirm', loading, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-lg p-6">
        <h2 className="font-display text-xl font-bold text-slate-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onCancel} variant="ghost" disabled={loading}>Cancel</Button>
          <Button onClick={onConfirm} disabled={loading} className="disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Updating...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
