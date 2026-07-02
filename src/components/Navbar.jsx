import { useState, useEffect } from 'react';
import { useCart } from '../store/CartContext';
import { ShoppingCart, User, Search } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

export default function Navbar() {
  const { itemCount, setIsOpen } = useCart();
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  
  const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '');

  // to only update URL params after 300 ms of inactivity
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    const val = debouncedSearch.trim();
    if (pathname !== '/') {
      navigate(`/?search=${encodeURIComponent(val)}`);
      return;
    }
    setSearchParams(prev => {
      if (val) {
        prev.set('search', val);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  }, [debouncedSearch]); 

  const isCheckout = pathname === '/checkout';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-logo">nua.</a>

        {isCheckout ? (
          <div className="navbar-secure-title">
             Checkout
          </div>
        ) : (
          <>
           {/* search bar */}
            <div className="navbar-search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search here.."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                aria-label="Search products"
              />
            </div>

            <nav className="navbar-links">
              <a href="/">Shop All</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Unisex</a>
              <a href="#" onClick={(e) => e.preventDefault()}>About Nua</a>

           {/* More dropdown */}
              <div
                className="more-wrapper"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <span className="more-btn">More ▾</span>
                <div className={`more-dropdown ${moreOpen ? 'open' : ''}`}>
                  <a href="#" onClick={(e) => e.preventDefault()}>Nua Exclusives</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>Blog</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>My Nua Plan</a>
                </div>
              </div>
            </nav>

            <div className="navbar-actions">
              <button className="nav-profile-btn" aria-label="Profile">
                <User size={20} strokeWidth={2} />
              </button>

              <button className="cart-btn" onClick={() => setIsOpen(true)} aria-label="Open cart">
                <ShoppingCart size={20} strokeWidth={2} />
                {itemCount > 0 && <span className="badge">{itemCount}</span>}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}