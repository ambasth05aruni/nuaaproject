import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { getMockVariants, getSalePrice, getDefaultVariant, makeVariantKey, mockAddToCartApi } from '../data/mockVariants';
import LazyImage from './LazyImage';

export default function ProductCard({ product }) {
  const { addItem, setIsOpen } = useCart();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [apiError, setApiError] = useState('');

  async function handleQuickAdd(e) {
    e.preventDefault(); 
    if (added || isAdding) return;

    const { color, size } = getDefaultVariant(product);
    if (!color || !size || size.maxQty === 0) return;

    const { sale, original } = getSalePrice(product);

    setIsAdding(true);
    setApiError('');

    const itemObj = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: sale ?? original,
      variant: `${color.label} / ${size.label}`,
      variantKey: makeVariantKey(product.id, color.label, size.label),
      maxQty: size.maxQty,
    };

    try {
      await mockAddToCartApi(itemObj, 1);
      addItem(itemObj, 1);
      setIsOpen(true);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setApiError(err.message || 'Error occurred');
      setTimeout(() => setApiError(''), 2500);
    } finally {
      setIsAdding(false);
    }
  }

  // check if product has any available variant
  const { sizes } = getMockVariants(product);
  const hasStock = sizes.some(s => s.stock !== 'sold-out');
  const { sale, original } = getSalePrice(product);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-img-wrap">
        <LazyImage src={product.image} alt={product.title} className="product-img" />
      </Link>

      <div className="product-card-body">
        <Link to={`/product/${product.id}`} className="product-card-name">
          {product.title}
        </Link>
        <div className="product-card-price-row">
          <span className="product-card-price">₹{(sale ?? original).toFixed(2)}</span>
          {sale && <span className="product-card-original">₹{original.toFixed(2)}</span>}
        </div>
      </div>

      {apiError && (
        <span className="product-card-error">{apiError}</span>
      )}

      <button
        className={`product-card-add ${!hasStock ? 'sold-out' : ''} ${added ? 'added' : ''} ${isAdding ? 'loading' : ''}`}
        onClick={handleQuickAdd}
        disabled={!hasStock || added || isAdding}
        aria-label={`Add ${product.title} to cart`}
      >
        {!hasStock ? 'Sold Out' : isAdding ? 'Adding...' : added ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  );
}
