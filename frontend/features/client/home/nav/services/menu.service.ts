import axiosInstance from "@/shared/lib/axios";

export interface PriceRange {
  label: string;
  min: number;
  max: number | null;
}

export interface Category {
  code: string;
  name: string;
  slug: string;
  icon?: string;
  priceRanges?: PriceRange[];
  children?: Category[];
  parentId?: string | null;
  isActive?: boolean;
}

export const menuService = {
  getCategoryTree: async (): Promise<Category[]> => {
    try {
      // Endpoint public: /products/categories/tree
      const response = await axiosInstance.get("/products/categories/tree");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch menu categories:", error);
      return [];
    }
  },
};
