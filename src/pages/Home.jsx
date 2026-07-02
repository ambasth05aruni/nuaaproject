import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import useProducts from '../hooks/useProducts';
import { ShoppingBag } from 'lucide-react';

export default function Home() {
  const { products, loading, error, retry } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const productSectionRef = useRef(null);

  const searchQuery = searchParams.get('search') ?? '';
  const activeCategory = searchParams.get('category') ?? '';
  const activeSort = searchParams.get('sort') ?? 'default';

  // ─── Filter & Sort Logic ──────────────────────────────────────────────────
  const filteredBySearch = searchQuery
    ? products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  const filteredByCategory = activeCategory
    ? filteredBySearch.filter(p => p.category === activeCategory)
    : filteredBySearch;

  const sortedProducts = [...filteredByCategory].sort((a, b) => {
    if (activeSort === 'price-low-high') return a.price - b.price;
    if (activeSort === 'price-high-low') return b.price - a.price;
    if (activeSort === 'name-a-z') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <>
      <Hero productSectionRef={productSectionRef} />

      <section className="product-section" ref={productSectionRef}>
        <div className="product-section-inner">
          <div className="catalog-header">
            <h2 className="section-title">
              {activeCategory
                ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
                : 'All Products'}
            </h2>
            
            {/* Sort Dropdown */}
            {!error && !loading && products.length > 0 && (
              <div className="sort-dropdown-wrapper">
                <select
                  id="sort-select"
                  value={activeSort}
                  onChange={(e) => setSearchParams(prev => {
                    const val = e.target.value;
                    if (val !== 'default') {
                      prev.set('sort', val);
                    } else {
                      prev.delete('sort');
                    }
                    return prev;
                  })}
                  aria-label="Sort products"
                >
                  <option value="default">Sort by: All</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-a-z">Name: A to Z</option>
                </select>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          {!error && !loading && (
            <div className="category-tabs">
              {[
                { label: 'All Products', value: '' },
                { label: 'Men', value: "men's clothing" },
                { label: 'Women', value: "women's clothing" },
                { label: 'Jewellery', value: 'jewelery' },
                { label: 'Electronics', value: 'electronics' }
              ].map(tab => (
                <button
                  key={tab.label}
                  className={`category-tab-btn ${activeCategory === tab.value ? 'active' : ''}`}
                  onClick={() => setSearchParams(prev => {
                    if (tab.value) {
                      prev.set('category', tab.value);
                    } else {
                      prev.delete('category');
                    }
                    return prev;
                  })}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Error Banner with Retry */}
          {error && (
            <div className="catalog-error-banner">
              <p className="fetch-error">Could not load products. Please check your connection.</p>
              <button className="retry-btn" onClick={retry}>
                Try Again
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!error && (
            <div className="product-grid">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="product-card skeleton" />
                  ))
                : sortedProducts.map(p => <ProductCard key={p.id} product={p} />)
              }
            </div>
          )}

          {/* Empty Search/Filter State */}
          {sortedProducts.length === 0 && !loading && !error && (
            <div className="catalog-empty-state">
              <ShoppingBag size={40} className="empty-icon" />
              <h3>No products found</h3>
              <p>We couldn't find any products matching your search criteria.</p>
              <button className="clear-filters-btn" onClick={() => setSearchParams({})}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
