export type ProductSpecs = {
  label: string;
  value: string;
  order?: number;
  showInListing?: boolean;
  icon?: string;
}[];

export interface ProductFilters {
  [key: string]: string;
}

export interface ProductData {
  productCode: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  cover: {
    url: string;
  };
  image?: string;
  images: string[];
  slug: string;
  searchKey: string;
  specs: ProductSpecs;
  filters: ProductFilters;
  gallery: {
    url: string;
    mediaCode?: string;
  }[];
  description: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isBuildPc?: boolean;
  viewCount?: number;
  soldCount?: number;
}
