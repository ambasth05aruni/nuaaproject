import { describe, it, expect } from 'vitest';
import { getMockVariants, getDefaultVariant, getSalePrice, makeVariantKey } from '../src/data/mockVariants';

describe('Variant Selector & Pricing Logic Helpers', () => {
  const mockProduct = {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack',
    price: 109.95,
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
  };

  it('should deterministically generate correct colors and sizes based on product category', () => {
    const { colors, sizes } = getMockVariants(mockProduct);
    
    // Men clothing has 3 specific colors and 5 sizes
    expect(colors).toHaveLength(3);
    expect(colors[0]).toEqual({ label: 'Black', hex: '#1a1a1a' });
    expect(sizes).toHaveLength(5);
    expect(sizes[0].label).toBe('XS');
  });

  it('should identify stock states and quantity limits correctly', () => {
    const { sizes } = getMockVariants(mockProduct);
    
    sizes.forEach(s => {
      expect(['available', 'low-stock', 'sold-out']).toContain(s.stock);
      if (s.stock === 'available') {
        expect(s.maxQty).toBe(10);
      } else if (s.stock === 'low-stock') {
        expect(s.maxQty).toBe(3);
      } else {
        expect(s.maxQty).toBe(0);
      }
    });
  });

  it('should find first available variant as default variant', () => {
    const { color, size } = getDefaultVariant(mockProduct);
    expect(color).toBeDefined();
    expect(size).toBeDefined();
    expect(size.stock).not.toBe('sold-out');
  });

  it('should generate canonical variant keys correctly', () => {
    const key = makeVariantKey(1, 'Black', 'M');
    expect(key).toBe('1__Black__M');
  });

  it('should compute sale prices correctly for seeded IDs', () => {
    // ID 5 % 5 === 0 , will trigger sale pricing
    const saleProduct = { ...mockProduct, id: 5, price: 100 };
    const { sale, original } = getSalePrice(saleProduct);
    expect(sale).toBe(100);
    expect(original).toBe(130);

    // ID 1 - won't trigger sale pricong
    const normalProduct = { ...mockProduct, id: 1, price: 100 };
    const result = getSalePrice(normalProduct);
    expect(result.sale).toBeNull();
    expect(result.original).toBe(100);
  });
});
