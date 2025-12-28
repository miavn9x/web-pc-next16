// TypeScript types for Product Management

export interface MediaItem {
  url: string;
  mediaCode: string;
}

export interface ProductSpec {
  label: string;
  value: string;
  order: number;
  showInListing: boolean;
}

export interface Product {
  _id?: string;
  productCode: string;
  name: string;
  categoryCode: string;
  categorySlug?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  cover?: MediaItem;
  gallery?: MediaItem[];
  slug?: string;
  specs?: ProductSpec[];
  filters?: Record<string, any>;
  description?: string;
  content?: string;
  isActive: boolean;
  isFeatured: boolean;
  isBuildPc?: boolean; // New flag
  viewCount?: number;
  soldCount?: number;
  discountedPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  categoryCode: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  cover?: MediaItem;
  gallery: MediaItem[];
  specs: ProductSpec[];
  filters?: Record<string, any>;
  description?: string;
  content?: string;
  isActive: boolean;
  isFeatured: boolean;
  isBuildPc?: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryCode?: string;
  isFeatured?: boolean;
  isBuildPc?: boolean;
}

export interface ProductListResponse {
  message: string;
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errorCode: null;
}

export interface ProductResponse {
  message: string;
  data: Product;
  errorCode: null;
}
