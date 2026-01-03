import axiosInstance from "@/shared/lib/axios";
import { ProductData } from "../types";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryCode?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  isFeatured?: boolean;
}

export interface ProductResponse {
  data: ProductData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const productService = {
  // Get list of products
  getProducts: async (params?: GetProductsParams): Promise<ProductResponse> => {
    const response = await axiosInstance.get("/products", { params });
    return response.data;
  },

  // Get single product by slug (Used for SEO friendly Detail Page)
  getProductBySlug: async (slug: string): Promise<{ data: ProductData }> => {
    const response = await axiosInstance.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (
    code: string,
    limit: number = 4
  ): Promise<{ data: ProductData[] }> => {
    const response = await axiosInstance.get(`/products/${code}/related`, {
      params: { limit },
    });
    return response.data;
  },

  // Get full category tree
  getCategoriesTree: async (): Promise<{ data: any[] }> => {
    const response = await axiosInstance.get("/products/categories/tree");
    return response.data;
  },

  // Get price range (min/max) from active products
  getPriceRange: async (): Promise<{ data: { min: number; max: number } }> => {
    const response = await axiosInstance.get("/products/price-range");
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<any> => {
    const response = await axiosInstance.get(
      `/products/categories/find-by-slug/${slug}`
    );
    return response.data;
  },
};
