// addProduct.Types.ts
export interface Media {
  mediaCode: string;
  url: string;
}

export interface Variant {
  variantId: string;
  productCode: string;
  attributes: { size: string };
  originalPriceVi: string;
  discountPercentVi: string;
  originalPriceJa: string;
  discountPercentJa: string;
}

export interface ProductFormData {
  nameVi: string;
  nameJa: string;
  description: {
    vi: string;
    ja: string;
  };
  categoryVi: string;
  categoryJa: string;
  minPriceVi: string;
  maxPriceVi: string;
  discountPercentVi: string;
  minPriceJa: string;
  maxPriceJa: string;
  discountPercentJa: string;
  cover: File | Media | null; // Thêm Media vào type
  gallery: (File | Media)[]; // Thêm Media vào type
  hasVariants: boolean;
  variants: Variant[];
  error: string | null;
}
// addProduct.Types.ts

