"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAllProducts,
  getProductsByCategory,
  getProductDetail,
  deleteProduct,
} from "../services/listProductServices";
import type {
  Product,
  ProductDetail,
  ProductVariant,
} from "../types/listProduct.Types";

// Kiểu thông tin phân trang
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// Kiểu sản phẩm với thông tin danh mục đã được bổ sung
interface ProductWithCategory extends Product {
  categoryInfo?: number;
}

export const useProductsList = () => {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "ja">("vi");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Cache để lưu thông tin danh mục của các sản phẩm
  const [categoryCache, setCategoryCache] = useState<Record<string, number>>(
    {}
  );

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 50,
  });

  /**
   * @function fetchProductCategoryInfo
   * @description Lấy thông tin danh mục cho một sản phẩm từ API chi tiết
   * @param {string} productCode - Mã sản phẩm
   * @returns {Promise<number | undefined>} ID danh mục hoặc undefined
   */
  const fetchProductCategoryInfo = useCallback(
    async (productCode: string): Promise<number | undefined> => {
      try {
        // Kiểm tra cache trước
        if (categoryCache[productCode] !== undefined) {
          return categoryCache[productCode];
        }

        const productDetail = await getProductDetail(productCode);
        const categoryId = productDetail.category;

        // Lưu vào cache
        if (categoryId !== undefined) {
          setCategoryCache((prev) => ({
            ...prev,
            [productCode]: categoryId,
          }));
        }

        return categoryId;
      } catch {
        return undefined;
      }
    },
    [categoryCache]
  );

  /**
   * @function enrichProductsWithCategory
   * @description Bổ sung thông tin danh mục cho danh sách sản phẩm
   * @param {Product[]} productList - Danh sách sản phẩm gốc
   * @returns {Promise<ProductWithCategory[]>} Danh sách sản phẩm đã bổ sung thông tin danh mục
   */
  const enrichProductsWithCategory = useCallback(
    async (productList: Product[]): Promise<ProductWithCategory[]> => {
      const enrichedProducts = await Promise.all(
        productList.map(async (product) => {
          const categoryInfo = await fetchProductCategoryInfo(
            product.productCode
          );
          return {
            ...product,
            categoryInfo,
          };
        })
      );

      return enrichedProducts;
    },
    [fetchProductCategoryInfo]
  );

  /**
   * @function fetchProductsData
   * @description Lấy danh sách sản phẩm từ API, có thể lọc theo danh mục và phân trang.
   * @param {number} page - Trang hiện tại.
   * @param {number} limit - Số lượng sản phẩm trên mỗi trang.
   * @param {number | null} categoryId - ID danh mục để lọc, hoặc null nếu không lọc.
   */
  const fetchProductsData = useCallback(
    async (page = 1, limit = 50, categoryId: number | null = null) => {
      try {
        setLoading(true);
        let response;
        if (categoryId !== null) {
          response = await getProductsByCategory(categoryId, page, limit);
        } else {
          response = await getAllProducts(page, limit);
        }

        const data = response.data || [];
        const paginationInfo = response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: limit,
        };

        // Bổ sung thông tin danh mục cho các sản phẩm
        const enrichedProducts = await enrichProductsWithCategory(data);

        setProducts(enrichedProducts);
        setPagination(paginationInfo);
      } catch {
        toast.error("Lỗi khi tải danh sách sản phẩm");
        setProducts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: limit,
        });
      } finally {
        setLoading(false);
      }
    },
    [enrichProductsWithCategory]
  );

  // Effect để fetch products khi pagination hoặc bộ lọc thay đổi
  useEffect(() => {
    fetchProductsData(currentPage, itemsPerPage, selectedCategory);
  }, [currentPage, itemsPerPage, selectedCategory, fetchProductsData]);

  /**
   * @function openViewModal
   * @description Mở modal xem chi tiết sản phẩm.
   * @param {Product} product - Sản phẩm được chọn.
   */
  const openViewModal = async (product: Product) => {
    try {
      const productDetail = await getProductDetail(product.productCode);
      setSelectedProduct(productDetail);
      setVariants(productDetail.variants || []);
      setViewModalOpen(true);
    } catch {
      toast.error("Lỗi khi tải chi tiết sản phẩm");
    }
  };

  /**
   * @function closeViewModal
   * @description Đóng modal xem chi tiết sản phẩm.
   */
  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedProduct(null);
    setVariants([]);
  };

  /**
   * @function toggleLanguage
   * @description Chuyển đổi ngôn ngữ hiển thị.
   */
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "ja" : "vi"));
  };

  /**
   * @function getCategoryName
   * @description Lấy tên danh mục theo ID và ngôn ngữ.
   * @param {number} categoryId - ID của danh mục.
   * @returns {{ vi: string; ja: string }} Tên danh mục bằng tiếng Việt và tiếng Nhật.
   */
  const getCategoryName = (categoryId: number): { vi: string; ja: string } => {
    const categoryMap: Record<number, { vi: string; ja: string }> = {
      1: { vi: "Bánh tráng", ja: "ライスペーパー" },
      2: { vi: "Các loại khô", ja: "乾物類" },
      3: { vi: "Đồ ăn vặt", ja: "スナック" },
      4: { vi: "Trái cây", ja: "果物" },
      // Thêm các danh mục khác nếu có
    };
    return categoryMap[categoryId] || { vi: "Chưa phân loại", ja: "未分類" };
  };

  /**
   * @function getAvailableCategories
   * @description Lấy danh sách các ID danh mục có sẵn từ map để hiển thị bộ lọc.
   * @returns {number[]} Mảng các ID danh mục.
   */
  const getAvailableCategories = () => {
    // Lấy các ID danh mục từ categoryMap thay vì từ danh sách sản phẩm
    return Object.keys(getCategoryMap())
      .map(Number)
      .sort((a, b) => a - b);
  };

  // Hàm trợ giúp để lấy toàn bộ map danh mục
  const getCategoryMap = (): Record<number, { vi: string; ja: string }> => {
    return {
      1: { vi: "Bánh tráng", ja: "ライスペーパー" },
      2: { vi: "Các loại khô", ja: "乾物類" },
      3: { vi: "Đồ ăn vặt", ja: "スナック" },
      4: { vi: "Trái cây", ja: "果物" },
    };
  };

  /**
   * @function formatPrice
   * @description Định dạng giá tiền theo ngôn ngữ.
   * @param {string} price - Giá tiền dạng chuỗi.
   * @param {"vi" | "ja"} lang - Ngôn ngữ hiển thị.
   * @returns {string} Giá tiền đã định dạng.
   */
  const formatPrice = (price: string, lang: "vi" | "ja") => {
    const num = Number.parseFloat(price);
    if (isNaN(num)) return price;
    if (lang === "vi") {
      return `₫${num.toLocaleString("vi-VN")}`;
    } else {
      return `¥${num.toLocaleString("ja-JP")}`;
    }
  };

  /**
   * @function calculateSellingPrice
   * @description Tính giá bán sau khi áp dụng giảm giá.
   * @param {number} original - Giá gốc.
   * @param {number} discountPercent - Phần trăm giảm giá.
   * @returns {number} Giá bán.
   */
  const calculateSellingPrice = (original: number, discountPercent: number) => {
    const discount = discountPercent / 100;
    return Math.round(original * (1 - discount));
  };

  /**
   * @function handleDeleteProduct
   * @description Xử lý xóa sản phẩm.
   * @param {string} productCode - Mã sản phẩm cần xóa.
   */
  const handleDeleteProduct = async (productCode: string) => {
    const confirmMessage =
      language === "vi"
        ? "Bạn có chắc chắn muốn xóa sản phẩm này?"
        : "この商品を削除してもよろしいですか？";
    if (!confirm(confirmMessage)) return;

    try {
      setDeleting(productCode);
      await deleteProduct(productCode);

      // Xóa khỏi cache
      setCategoryCache((prev) => {
        const newCache = { ...prev };
        delete newCache[productCode];
        return newCache;
      });

      // Làm mới trang hiện tại sau khi xóa
      await fetchProductsData(currentPage, itemsPerPage, selectedCategory);

      const successMessage =
        language === "vi" ? "Xóa sản phẩm thành công" : "商品を削除しました";
      toast.success(successMessage);
    } catch {
      const errorMessage =
        language === "vi" ? "Lỗi khi xóa sản phẩm" : "商品削除エラー";
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  /**
   * @function handleCategoryFilter
   * @description Xử lý khi chọn bộ lọc danh mục.
   * @param {number | null} categoryId - ID danh mục được chọn.
   */
  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Đặt lại về trang 1 khi áp dụng bộ lọc
  };

  /**
   * @function clearCategoryFilter
   * @description Xóa bộ lọc danh mục.
   */
  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  /**
   * @function handlePageChange
   * @description Xử lý thay đổi trang.
   * @param {number} page - Số trang mới.
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  /**
   * @function handleItemsPerPageChange
   * @description Xử lý thay đổi số lượng sản phẩm trên mỗi trang.
   * @param {number} newItemsPerPage - Số lượng sản phẩm mới.
   */
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Đặt lại về trang 1 khi thay đổi số lượng mục trên mỗi trang
    }
  };

  /**
   * @function goToFirstPage
   * @description Chuyển đến trang đầu tiên.
   */
  const goToFirstPage = () => handlePageChange(1);

  /**
   * @function goToLastPage
   * @description Chuyển đến trang cuối cùng.
   */
  const goToLastPage = () => handlePageChange(pagination.totalPages);

  /**
   * @function goToNextPage
   * @description Chuyển đến trang kế tiếp.
   */
  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  /**
   * @function goToPrevPage
   * @description Chuyển đến trang trước đó.
   */
  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  /**
   * @function refreshProducts
   * @description Làm mới danh sách sản phẩm hiện tại.
   */
  const refreshProducts = useCallback(() => {
    fetchProductsData(currentPage, itemsPerPage, selectedCategory);
  }, [fetchProductsData, currentPage, itemsPerPage, selectedCategory]);

  // Lọc sản phẩm theo từ khóa tìm kiếm (lọc phía client sau khi API trả về)
  const searchedProducts = products.filter((product) => {
    return product.name[language]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return {
    products: searchedProducts,
    variants: variants.map((variant, index) => ({
      variantId: `variant_${index}`,
      productCode: selectedProduct?.productCode || "",
      attributes: { variant: variant.label[language] },
      originalPrice: {
        vi: variant.price.vi.original,
        ja: variant.price.ja.original,
      },
      discountPercent: {
        vi: variant.price.vi.discountPercent,
        ja: variant.price.ja.discountPercent,
      },
    })),
    loading,
    language,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    toggleLanguage,
    formatPrice,
    openViewModal,
    closeViewModal,
    viewModalOpen,
    selectedProduct,
    calculateSellingPrice,
    getCategoryName,
    getAvailableCategories,
    handleCategoryFilter,
    clearCategoryFilter,
    handleDeleteProduct,
    deleting,
    // Phân trang
    currentPage,
    itemsPerPage,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    fetchProducts: refreshProducts,
    refreshProducts,
  };
};
