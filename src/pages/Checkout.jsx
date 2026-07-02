import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { CheckCircle2, ChevronLeft, CreditCard, ShoppingBag, Truck } from 'lucide-react';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null); // hold order data for success page
  const [errors, setErrors] = useState({});

  const shippingFee = subtotal > 499 ? 0 : 50;
  const grandTotal = subtotal + shippingFee;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP/Postal code is required';
    } else if (!/^\d{6}$/.test(formData.zip)) {
      newErrors.zip = 'ZIP code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate payment processing latency
    setTimeout(() => {
      const orderId = `NUA-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Freeze order summary locally before clearing cart
      setOrderSummary({
        orderId,
        orderDate,
        items: [...items],
        subtotal,
        shippingFee,
        grandTotal,
        shippingInfo: { ...formData }
      });

      clearCart();
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }, 1200);
  }

  // --- Render Order Placed Success Screen ---
  if (orderSummary) {
    return (
      <div className="order-success-container">
        <div className="success-card">
          <div className="success-header">
            <div className="icon-wrapper">
              <CheckCircle2 size={48} className="success-icon" />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p className="success-subtitle">Thank you for your order. We're getting it ready to ship.</p>
          </div>

          <div className="order-details-grid">
            {/* Column 1: Order Meta */}
            <div className="details-box">
              <h3>Order Information</h3>
              <div className="details-row">
                <span className="label">Order Number:</span>
                <span className="value value--highlight">{orderSummary.orderId}</span>
              </div>
              <div className="details-row">
                <span className="label">Date:</span>
                <span className="value">{orderSummary.orderDate}</span>
              </div>
              <div className="details-row">
                <span className="label">Delivery Status:</span>
                <span className="value badge--shipping">
                  <Truck size={14} /> Estimated 3-5 Business Days
                </span>
              </div>
              <div className="details-row">
                <span className="label">Payment Method:</span>
                <span className="value text-capitalize">{orderSummary.shippingInfo.paymentMethod === 'card' ? 'Credit / Debit Card' : orderSummary.shippingInfo.paymentMethod.toUpperCase()}</span>
              </div>
            </div>

            {/* Column 2: Shipping details */}
            <div className="details-box">
              <h3>Delivery Address</h3>
              <p className="address-name">{orderSummary.shippingInfo.name}</p>
              <p className="address-text">{orderSummary.shippingInfo.address}</p>
              <p className="address-text">{orderSummary.shippingInfo.city} - {orderSummary.shippingInfo.zip}</p>
              <p className="address-phone">📞 {orderSummary.shippingInfo.phone}</p>
            </div>
          </div>

          {/* Receipt items list */}
          <div className="receipt-items-list">
            <h3>Items in this Order</h3>
            {orderSummary.items.map(item => (
              <div key={item.variantKey} className="receipt-item">
                <img src={item.image} alt={item.title} />
                <div className="receipt-item-info">
                  <p className="receipt-name">{item.title}</p>
                  <p className="receipt-variant">{item.variant}</p>
                  <p className="receipt-qty-price">Qty: {item.qty} × ₹{item.price.toFixed(2)}</p>
                </div>
                <div className="receipt-item-total">
                  ₹{(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Invoice summary */}
          <div className="receipt-invoice">
            <div className="invoice-row">
              <span>Subtotal</span>
              <span>₹{orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="invoice-row">
              <span>Shipping</span>
              <span>{orderSummary.shippingFee === 0 ? 'FREE' : `₹${orderSummary.shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="invoice-row invoice-row--grand">
              <span>Grand Total Paid</span>
              <span>₹{orderSummary.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Empty Cart Guard ---
  if (items.length === 0) {
    return (
      <div className="checkout-empty-container">
        <div className="empty-card">
          <ShoppingBag size={48} className="empty-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart before checking out.</p>
          <Link to="/" className="return-shop-btn">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  // --- Render Checkout Page ---
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="back-link-wrapper">
          <Link to="/" className="back-link">
            <ChevronLeft size={16} /> Back to Catalog
          </Link>
        </div>

        <h1 className="checkout-title">Secure Checkout</h1>

        <div className="checkout-layout">
          {/* Shipping Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Shipping Address</h2>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Apartment, Street Address, Area"
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="zip">ZIP / Postal Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="400001"
                    className={errors.zip ? 'input-error' : ''}
                  />
                  {errors.zip && <span className="error-text">{errors.zip}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-option-label ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                  </div>
                </label>

                <label className={`payment-option-label ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <Truck size={18} />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                </label>

                <label className={`payment-option-label ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <ShoppingBag size={18} />
                    <span>UPI (GPay / PhonePe)</span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="place-order-btn">
              {isSubmitting ? 'Processing Payment...' : `Pay & Place Order • ₹${grandTotal.toFixed(2)}`}
            </button>
          </form>

          {/* Checkout Sidebar Summary */}
          <div className="checkout-summary-sidebar">
            <div className="sidebar-card">
              <h2>Order Summary</h2>
              
              <div className="summary-items-list">
                {items.map(item => (
                  <div key={item.variantKey} className="summary-item">
                    <div className="summary-img-wrapper">
                      <img src={item.image} alt={item.title} />
                      <span className="summary-qty-badge">{item.qty}</span>
                    </div>
                    <div className="summary-item-details">
                      <p className="summary-name">{item.title}</p>
                      <p className="summary-variant">{item.variant}</p>
                    </div>
                    <div className="summary-price">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="totals-row">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="totals-row totals-row--grand">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
