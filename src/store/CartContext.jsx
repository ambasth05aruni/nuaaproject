import { createContext, useContext, useEffect, useReducer, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'nua_cart';

// localstorage

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      item =>
        item &&
        typeof item.id === 'number' &&
        typeof item.price === 'number' &&
        typeof item.variantKey === 'string' &&
        typeof item.qty === 'number' &&
        item.qty >= 1
    );
  } catch {
    return []; 
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable 
  }
}

//reducer

export function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      const { item, qty } = action;
      const idx = state.findIndex(i => i.variantKey === item.variantKey);
      if (idx !== -1) {
        return state.map((i, n) =>
          n === idx ? { ...i, qty: Math.min(i.qty + qty, i.maxQty) } : i
        );
      }
      return [...state, { ...item, qty: Math.min(qty, item.maxQty) }];
    }

    case 'REMOVE':
      return state.filter(i => i.variantKey !== action.variantKey);

    case 'UPDATE_QTY': {
      const { variantKey, qty } = action;
      if (qty < 1) return state.filter(i => i.variantKey !== variantKey);
      return state.map(i =>
        i.variantKey === variantKey
          ? { ...i, qty: Math.min(qty, i.maxQty) }
          : i
      );
    }

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}

// Provider 

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Persist on every items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  function addItem(item, qty = 1) {
    if (!item?.variantKey || !item?.id || qty < 1) return;
    if ((item.maxQty ?? 0) === 0) return; // sold-out guard
    dispatch({ type: 'ADD', item, qty });
    addToast('Added to Cart ✓', 'success');
  }

  function removeItem(variantKey) {
    dispatch({ type: 'REMOVE', variantKey });
    addToast('Removed Successfully', 'info');
  }

  function updateQty(variantKey, qty) {
    dispatch({ type: 'UPDATE_QTY', variantKey, qty });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' });
  }

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal  = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        toasts,
        addToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
