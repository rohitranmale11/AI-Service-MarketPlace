import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message) => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message }]);
    setTimeout(() => {
      setToasts((items) => items.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="glass flex items-center gap-3 rounded-2xl p-4 text-sm text-slate-700">
            <CheckCircle2 className="h-5 w-5 flex-none text-emerald-500" />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss toast">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
