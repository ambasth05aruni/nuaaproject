import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images = [], alt }) {
  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' });
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images.length) return null;

  function handleMouseMove(e) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  }

  function handleMouseEnter() {
    setIsZoomed(true);
  }

  function handleMouseLeave() {
    setIsZoomed(false);
    setZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
  }

  return (
    <div className="image-gallery">
      <div
        className={`gallery-main ${isZoomed ? 'zoomed' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {images.length > 1 && (
          <button
            className="gallery-nav-btn prev"
            onClick={(e) => {
              e.stopPropagation();
              setActive(prev => (prev - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        )}

        <img
          src={images[active]}
          alt={alt}
          style={isZoomed ? zoomStyle : {}}
          className="main-gallery-image"
        />

        {images.length > 1 && (
          <button
            className="gallery-nav-btn next"
            onClick={(e) => {
              e.stopPropagation();
              setActive(prev => (prev + 1) % images.length);
            }}
            aria-label="Next image"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`gallery-thumb ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt={`${alt} thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
