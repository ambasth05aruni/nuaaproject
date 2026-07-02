//  mock variant data ,  per product id + category

const COLOR_MAP = {
  "men's clothing":   [{ label: 'Black', hex: '#1a1a1a' }, { label: 'Navy', hex: '#1d3557' }, { label: 'Brown', hex: '#7b4f2e' }],
  "women": [{ label: 'Rose', hex: '#c9456a' }, { label: 'Sage', hex: '#4a7c59' }, { label: 'Lilac', hex: '#9b7fc8' }],
  electronics:        [{ label: 'Space Grey', hex: '#6b6b6b' }, { label: 'Midnight', hex: '#1a1a1a' }, { label: 'Silver', hex: '#d4d4d4' }],
  jewelery:           [{ label: 'Gold', hex: '#c5a028' }, { label: 'Silver', hex: '#aaaaaa' }, { label: 'Rose Gold', hex: '#b76e79' }],
};

const SIZE_MAP = {
  "men's clothing":   ['XS', 'S', 'M', 'L', 'XL'],
  "women": ['XS', 'S', 'M', 'L', 'XL'],
  electronics:        ['64GB', '128GB', '256GB'],
  jewelery:           ['6', '7', '8', '9'],
};

// Max purchasable qty per stock state
const MAX_QTY_BY_STOCK = {
  'available':  10,
  'low-stock':  3,
  'sold-out':   0,
};

// deterministic per size label + product id
function stockState(id, sizeLabel) {
  const seed = (id * 13 + sizeLabel.length * 7) % 10;
  if (seed === 9) return 'sold-out';
  if (seed >= 7)  return 'low-stock';
  return 'available';
}

export function getMockVariants(product) {
  const colors = COLOR_MAP[product.category] ?? COLOR_MAP['electronics'];
  const sizes   = SIZE_MAP[product.category]  ?? SIZE_MAP['electronics'];

  const sizeVariants = sizes.map(s => {
    const stock = stockState(product.id, s);
    return { label: s, stock, maxQty: MAX_QTY_BY_STOCK[stock] };
  });

  return { colors, sizes: sizeVariants };
}

// id + colorLabel + sizeLabel
export function makeVariantKey(productId, colorLabel, sizeLabel) {
  return `${productId}__${colorLabel}__${sizeLabel}`;
}

// get the first available variant for a product
export function getDefaultVariant(product) {
  const { colors, sizes } = getMockVariants(product);
  const defaultColor = colors[0];
  const defaultSize  = sizes.find(s => s.stock !== 'sold-out') ?? sizes[0];
  return { color: defaultColor, size: defaultSize };
}

// Sale price for ~40% of products - demo purpose onlyy
export function getSalePrice(product) {
  if (product.id % 5 === 0 || product.id % 7 === 0) {
    return { sale: product.price, original: +(product.price * 1.3).toFixed(2) };
  }
  return { sale: null, original: product.price };
}

const CATEGORY_IMAGES = {
  "men's clothing": [
    "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&auto=format&fit=crop&q=80"
  ],
  "women's clothing": [
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop&q=80"
  ],
  "electronics": [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
  ],
  "jewelery": [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
  ]
};

export function getProductImages(product) {
  const extra = CATEGORY_IMAGES[product.category] ?? CATEGORY_IMAGES["electronics"];
  return [product.image, ...extra];
}

export function mockAddToCartApi(item, qty) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;
      if (isSuccess) {
        resolve();
      } else {
        reject(new Error("Network congestion. Please try again."));
      }
    }, 600); 
  });
}
