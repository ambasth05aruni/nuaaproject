import { useCart } from '../store/CartContext';
import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, setIsOpen, updateQty, removeItem } = useCart();

  return (
    <>
    {/*  Close drawer when clicking outside */}
      <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-label="Shopping cart" aria-modal="true">

        <div className="drawer-header">
          <h2>Your Shopping Cart {itemCount > 0 && <span className="drawer-count">({itemCount})</span>}</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingBag size={40} className="empty-icon" />
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => {
              const [, sizeName] = item.variant ? item.variant.split(' / ') : [];
              // Create product URL with selected size
              const productUrl = `/product/${item.id}${sizeName ? `?size=${encodeURIComponent(sizeName)}` : ''}`;

              return (
                <div key={item.variantKey} className="cart-item">
                  <Link to={productUrl} onClick={() => setIsOpen(false)} className="cart-item-img-link">
                    <img src={item.image} alt={item.title} />
                  </Link>

                  <div className="item-info">
                    <Link to={productUrl} onClick={() => setIsOpen(false)} className="item-name">
                      {item.title}
                    </Link>
                    {item.variant && <p className="item-variant">{item.variant}</p>}
                  <p className="item-price">₹{(item.price * item.qty).toFixed(2)}</p>

                  <div className="qty-row">
                    <button
                      onClick={() => updateQty(item.variantKey, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.variantKey, item.qty + 1)}
                      disabled={item.qty >= item.maxQty}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
{/* Show stock limit message */}
                  {item.qty >= item.maxQty && (
                    <p className="item-max-note">Max stock reached</p>
                  )}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.variantKey)}
                  aria-label={`Remove ${item.title}`}
                >Remove</button>
              </div>
            );
          })
          )}
        </div>

        {items.length > 0 && (
          (() => {
            const shippingFee = subtotal > 499 ? 0 : 50;
            const grandTotal = subtotal + shippingFee;
            return (
              <div className="drawer-footer">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="bill-row">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="bill-row grand-total">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" onClick={() => setIsOpen(false)} className="checkout-btn">Checkout</Link>
              </div>
            );
          })()
        )}
      </div>
    </>
  );
}
