// Product API Service

import type {
  ProductFormData,
  ProductFilters,
  ProductListResponse,
  ProductResponse,
} from "../types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/admin/products`;

export const productService = {
  /**
   * Get all products with filters
   */
  async getAll(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.categoryCode)
      params.append("categoryCode", filters.categoryCode);
    if (filters.isFeatured !== undefined) {
      params.append("isFeatured", filters.isFeatured.toString());
    }
    if (filters.isBuildPc !== undefined) {
      params.append("isBuildPc", filters.isBuildPc.toString());
    }

    const response = await fetch(`${API_URL}?${params}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  /**
   * Get product by code
   */
  async getByCode(code: string): Promise<ProductResponse> {
    const response = await fetch(`${API_URL}/${code}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  },

  /**
   * Create new product
   */
  async create(data: ProductFormData): Promise<ProductResponse> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  },

  /**
   * Update product
   */
  async update(
    code: string,
    data: Partial<ProductFormData>
  ): Promise<ProductResponse> {
    const response = await fetch(`${API_URL}/${code}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  },

  /**
   * Delete product
   */
  async delete(code: string): Promise<void> {
    const response = await fetch(`${API_URL}/${code}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  },

  /**
   * Toggle active status
   */
  async toggleActive(code: string): Promise<ProductResponse> {
    const response = await fetch(`${API_URL}/${code}/toggle-active`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle active status");
    }

    return response.json();
  },

  /**
   * Toggle featured status
   */
  async toggleFeatured(code: string): Promise<ProductResponse> {
    const response = await fetch(`${API_URL}/${code}/toggle-featured`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle featured status");
    }

    return response.json();
  },

  /**
   * Toggle Build PC status
   */
  async toggleBuildPc(code: string): Promise<ProductResponse> {
    const response = await fetch(`${API_URL}/${code}/toggle-build-pc`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle Build PC status");
    }

    return response.json();
  },
};
