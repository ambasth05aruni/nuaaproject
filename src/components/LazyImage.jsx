import { useEffect, useRef, useState } from 'react';

export default function LazyImage({ src, alt, className }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setLoaded(true);
          };
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } 
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={ref} className={`lazy-img-wrap ${loaded ? 'loaded' : ''}`}>
      {loaded && <img src={src} alt={alt} className={className} />}
    </div>
  );
}
