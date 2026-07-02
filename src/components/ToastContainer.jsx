import { useCart } from '../store/CartContext';
import { CheckCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast-alert toast-alert--${t.type}`}>
          {t.type === 'success' ? (
            <CheckCircle size={16} className="toast-icon" />
          ) : (
            <Info size={16} className="toast-icon" />
          )}
          <span className="toast-message">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
