// Hook for Product List management

import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
import type { Product, ProductFilters } from "../types";

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [isFeatured, setIsFeatured] = useState<boolean | undefined>(undefined);
  const [isBuildPc, setIsBuildPc] = useState<boolean | undefined>(undefined);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters: ProductFilters = {
        page,
        limit,
      };

      if (search) filters.search = search;
      if (categoryCode) filters.categoryCode = categoryCode;
      if (isFeatured !== undefined) filters.isFeatured = isFeatured;
      if (isBuildPc !== undefined) filters.isBuildPc = isBuildPc;

      const response = await productService.getAll(filters);
      setProducts(response.data || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(response.meta?.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]); // Ensure valid state on error
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryCode, isFeatured]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = useCallback(
    async (code: string) => {
      if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

      setDeleting(code);
      try {
        await productService.delete(code);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Xóa sản phẩm thất bại!");
      } finally {
        setDeleting(null);
      }
    },
    [fetchProducts]
  );

  const handleToggleActive = useCallback(
    async (code: string) => {
      try {
        await productService.toggleActive(code);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to toggle active:", error);
      }
    },
    [fetchProducts]
  );

  const handleToggleFeatured = useCallback(
    async (code: string) => {
      try {
        await productService.toggleFeatured(code);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to toggle featured:", error);
      }
    },
    [fetchProducts]
  );

  const handleToggleBuildPc = useCallback(
    async (code: string) => {
      try {
        await productService.toggleBuildPc(code);
        await fetchProducts();
      } catch (error) {
        console.error("Failed to toggle Build PC:", error);
      }
    },
    [fetchProducts]
  );

  return {
    products,
    loading,
    deleting,
    search,
    setSearch,
    categoryCode,
    setCategoryCode,
    isFeatured,
    setIsFeatured,
    isBuildPc,
    setIsBuildPc,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    handleDelete,
    handleToggleActive,
    handleToggleFeatured,
    handleToggleBuildPc,
    refreshProducts: fetchProducts,
  };
}
