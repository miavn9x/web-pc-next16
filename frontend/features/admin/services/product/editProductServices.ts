// editProductServices.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

import axiosInstance from "@/shared/lib/axios";

// Helper function to convert relative URLs to absolute URLs
const getFullImageUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

interface Media {
  mediaCode: string;
  url: string;
}

interface Product {
  cover: Media | null;
  gallery: Media[];
  variants: any[];
  name: { vi: string; ja: string };
  description: { vi: string; ja: string };
  priceRange: {
    vi: { min: string; max: string };
    ja: { min: string; max: string };
  };
  category: number;
  [key: string]: any;
}

export const getProductByCode = async (
  productCode: string
): Promise<Product> => {
  try {
    const url = `${API_URL}/products/${productCode}`;
    const response = await axiosInstance.get(url);
    if (!response.data?.data) {
      throw new Error("Dữ liệu sản phẩm không hợp lệ");
    }
    const product = response.data.data;

    // Transform image URLs to absolute URLs and ensure proper structure
    const transformedProduct: Product = {
      ...product,
      cover: product.cover
        ? {
            mediaCode: product.cover.mediaCode || "",
            url: getFullImageUrl(product.cover.url || ""),
          }
        : null,
      gallery:
        product.gallery?.map((image: any) => ({
          mediaCode: image.mediaCode || "",
          url: getFullImageUrl(image.url || ""),
        })) || [],
      variants: product.variants || [],
      name: product.name || { vi: "", ja: "" },
      description: product.description || { vi: "", ja: "" },
      priceRange: product.priceRange || {
        vi: { min: "", max: "" },
        ja: { min: "", max: "" },
      },
      category: product.category || 1,
    };
    return transformedProduct;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Lỗi không xác định khi tải dữ liệu sản phẩm");
  }
};

export const updateProduct = async (
  productCode: string,
  productData: any
): Promise<any> => {
  try {
    const url = `${API_URL}/products/${productCode}`;
    const response = await axiosInstance.patch(url, productData);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Lỗi khi cập nhật sản phẩm");
  }
};
