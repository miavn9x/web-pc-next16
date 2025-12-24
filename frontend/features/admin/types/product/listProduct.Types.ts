// listProduct.Types.ts
export interface ProductCover {
  mediaCode: string;
  url: string;
}

export interface PriceRange {
  vi: {
    min: string;
    max: string;
  };
  ja: {
    min: string;
    max: string;
  };
}

export interface ProductName {
  vi: string;
  ja: string;
}

export interface ProductDescription {
  vi: string;
  ja: string;
}

export interface ProductCategory {
  vi: string;
  ja: string;
}

// Product list item (from /api/products)
// Based on API documentation, category is not returned in list API
export interface Product {
  productCode: string;
  name: ProductName;
  cover: ProductCover;
  priceRange: PriceRange;
  category?: number; // Optional, only available in detail API
}

// Product detail (from /api/products/:productCode)
export interface ProductDetail {
  category: number; // Category ID from backend (always number according to API doc)
  productCode: string;
  name: ProductName;
  description: ProductDescription;
  gallery: ProductCover[];
  cover: ProductCover;
  priceRange: PriceRange;
  variants: ProductVariant[];
  tokens: {
    vi: string[];
    ja: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  label: ProductName;
  price: {
    vi: {
      original: number;
      discountPercent: number;
    };
    ja: {
      original: number;
      discountPercent: number;
    };
  };
}

// For backward compatibility, keeping the old Variant interface
export interface Variant {
  variantId: string;
  productCode: string;
  attributes: Record<string, string>;
  originalPrice: {
    vi: number;
    ja: number;
  };
  discountPercent: {
    vi: number;
    ja: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  errorCode: string | null;
}
