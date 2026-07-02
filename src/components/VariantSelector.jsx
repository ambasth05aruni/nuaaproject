export default function VariantSelector({ colors, sizes, selectedColor, selectedSize, onColorChange, onSizeChange }) {
  return (
    <div className="variant-selector">

      {/* Colour switches */}
      <div className="variant-group">
        <p className="variant-label">
          Colour: <span className="variant-value">{colors[selectedColor]?.label}</span>
        </p>
        <div className="color-swatches">
          {colors.map((c, i) => (
            <button
              key={i}
              className={`swatch ${i === selectedColor ? 'active' : ''}`}
              style={{ background: c.hex }}
              onClick={() => onColorChange(i)}
              aria-label={c.label}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {/* Size buttons */}
      <div className="variant-group">
        <p className="variant-label">Size</p>
        <div className="size-btns">
          {sizes.map((s, i) => (
            <button
              key={i}
              className={`size-btn size-btn--${s.stock} ${s.label === selectedSize ? 'active' : ''}`}
              onClick={() => s.stock !== 'sold-out' && onSizeChange(s.label)}
              disabled={s.stock === 'sold-out'}
              aria-label={`Size ${s.label}${s.stock === 'sold-out' ? ' — sold out' : s.stock === 'low-stock' ? ' — low stock' : ''}`}
            >
              {s.label}
              {s.stock === 'sold-out' && <span className="size-badge">Sold Out</span>}
              {s.stock === 'low-stock' && <span className="size-badge size-badge--low">Low Stock</span>}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
