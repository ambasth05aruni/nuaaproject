import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useProduct from '../hooks/useProduct';
import { getMockVariants, getSalePrice, makeVariantKey, getProductImages, mockAddToCartApi } from '../data/mockVariants';
import ImageGallery from '../components/ImageGallery';
import VariantSelector from '../components/VariantSelector';
import { useCart } from '../store/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addItem, setIsOpen } = useCart();

  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addedTimer = useRef(null);

  // Clean up timer on unmount to avoid state update on unmounted component
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  
  useEffect(() => { setQty(1); setAdded(false); setApiError(''); setShowStickyBar(false); }, [id]);

  useEffect(() => {
    function handleScroll() {
      if (window.innerWidth <= 767) {
        setShowStickyBar(window.scrollY > 400);
      } else {
        setShowStickyBar(false);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // URL-reflected variant state
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedColorIdx = Number(searchParams.get('color') ?? 0);
  const selectedSizeLabel = searchParams.get('size') ?? '';

  function setColor(i) { setSearchParams(p => { p.set('color', i); return p; }); }
  function setSize(s)   { setSearchParams(p => { p.set('size', s); return p; }); }

  if (loading) {
    return (
      <div className="product-detail pd-skeleton">
        <div className="pd-inner">
          {/* Left - Gallery Skeleton */}
          <div className="pd-skeleton-gallery">
            <div className="pd-skeleton-image shimmer" />
            <div className="pd-skeleton-thumbs">
              <div className="pd-skeleton-thumb shimmer" />
              <div className="pd-skeleton-thumb shimmer" />
              <div className="pd-skeleton-thumb shimmer" />
            </div>
          </div>

          {/* Right - Info Skeleton */}
          <div className="pd-skeleton-info">
            <div className="pd-skeleton-category shimmer" />
            <div className="pd-skeleton-title shimmer" />
            <div className="pd-skeleton-rating shimmer" />
            <div className="pd-skeleton-price shimmer" />
            <div className="pd-skeleton-desc shimmer" />
            <div className="pd-skeleton-desc shimmer" />
            <div className="pd-skeleton-swatches">
              <div className="pd-skeleton-option shimmer" />
              <div className="pd-skeleton-option shimmer" />
              <div className="pd-skeleton-option shimmer" />
            </div>
            <div className="pd-skeleton-actions">
              <div className="pd-skeleton-qty shimmer" />
              <div className="pd-skeleton-btn shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="pd-error-container">
        <div className="error-card">
          <ShoppingBag size={48} className="error-icon" />
          <h2>Product Not Found</h2>
          <p>We couldn't find the product you're looking for. It may have been removed or the ID is incorrect.</p>
          <Link to="/" className="return-shop-btn">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }
  if (!product) return null;

  const { colors, sizes } = getMockVariants(product);
  const { sale, original } = getSalePrice(product);

  // Resolve active size — default to first available if URL has none
  const activeSize = selectedSizeLabel || sizes.find(s => s.stock !== 'sold-out')?.label || '';
  const activeSizeObj = sizes.find(s => s.label === activeSize);
  const activeColor = colors[selectedColorIdx] ?? colors[0];

  const isSoldOut = !activeSizeObj || activeSizeObj.stock === 'sold-out';
  const maxQty    = activeSizeObj?.maxQty ?? 0;

  // Reset qty if it exceeds new maxQty (e.g. switching from available → low-stock)
  const safeQty = Math.min(qty, maxQty || 1);

  // Canonical key for this exact variant
  const variantKey = makeVariantKey(product.id, activeColor.label, activeSize);

  async function handleAddToCart() {
    if (isSoldOut || added || isAdding || safeQty < 1) return;

    setIsAdding(true);
    setApiError('');

    const itemObj = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: sale ?? original,
      variant: `${activeColor.label} / ${activeSize}`,
      variantKey,
      maxQty,
    };

    try {
      await mockAddToCartApi(itemObj, safeQty);
      addItem(itemObj, safeQty);
      setIsOpen(true);
      setAdded(true);
      addedTimer.current = setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setApiError(err.message || 'Failed to add item.');
      setTimeout(() => setApiError(''), 3000);
    } finally {
      setIsAdding(false);
    }
  }

  const images = getProductImages(product);

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <Link to={`/?category=${encodeURIComponent(product.category)}`} className="text-capitalize">
          {product.category}
        </Link>
        <span className="separator">/</span>
        <span className="current">{product.title}</span>
      </nav>

      <div className="pd-inner">

        {/* Left — Gallery */}
        <ImageGallery images={images} alt={product.title} />

        {/* Right — Info */}
        <div className="pd-info">
          <p className="pd-category">{product.category}</p>
          <h1 className="pd-title">{product.title}</h1>

          {/* Price */}
          <div className="pd-price-row">
            <span className="pd-price">₹{(sale ?? original).toFixed(2)}</span>
            {sale && <span className="pd-original">₹{original.toFixed(2)}</span>}
            {sale && <span className="pd-badge">Sale</span>}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="pd-rating">
              <span className="pd-stars">{'★'.repeat(Math.round(product.rating.rate))}{'☆'.repeat(5 - Math.round(product.rating.rate))}</span>
              <span className="pd-rating-count">({product.rating.count} reviews)</span>
            </div>
          )}

          <p className="pd-desc">{product.description}</p>

          {/* Variants */}
          <VariantSelector
            colors={colors}
            sizes={sizes}
            selectedColor={selectedColorIdx}
            selectedSize={activeSize}
            onColorChange={setColor}
            onSizeChange={setSize}
          />

          {/* Low stock warning */}
          {activeSizeObj?.stock === 'low-stock' && (
            <p className="pd-stock-warn">⚠ Only a few left in stock</p>
          )}

          {/* API Error Alert */}
          {apiError && (
            <p className="pd-api-error">⚠ {apiError}</p>
          )}

          {/* Quantity + CTA */}
          <div className="pd-actions">
            <div className="qty-picker">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={safeQty <= 1 || isAdding}
                aria-label="Decrease quantity"
              >−</button>
              <span>{safeQty}</span>
              <button
                onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                disabled={safeQty >= maxQty || isSoldOut || isAdding}
                aria-label="Increase quantity"
              >+</button>
            </div>

            <button
              className={`pd-add-btn ${isSoldOut ? 'sold-out' : ''} ${added ? 'added' : ''} ${isAdding ? 'loading' : ''}`}
              onClick={handleAddToCart}
              disabled={isSoldOut || added || isAdding}
            >
              {isSoldOut ? 'Sold Out' : isAdding ? 'Adding...' : added ? 'Added ✓' : 'Add to Cart'}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className={`mobile-sticky-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="sticky-bar-inner">
          <div className="sticky-bar-info">
            <p className="sticky-title">{product.title}</p>
            <p className="sticky-price">₹{(sale ?? original).toFixed(2)}</p>
          </div>
          <button
            className={`sticky-add-btn ${isSoldOut ? 'sold-out' : ''} ${added ? 'added' : ''} ${isAdding ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={isSoldOut || added || isAdding}
          >
            {isSoldOut ? 'Sold Out' : isAdding ? 'Adding...' : added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
