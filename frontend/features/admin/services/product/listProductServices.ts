import axiosInstance from "@/shared/lib/axios";
import type {
  ApiResponse,
  Product,
  ProductDetail,
} from "../../types/product/listProduct.Types";

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

// Kiểu phản hồi có phân trang
interface PaginatedResponse<T> {
  data: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

// Hàm trợ giúp chuyển đổi URL tương đối thành URL tuyệt đối
const getFullImageUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

/**
 * @function getAllProducts
 * @description Lấy danh sách tất cả sản phẩm với phân trang.
 * @param {number} page - Số trang hiện tại.
 * @param {number} limit - Số lượng sản phẩm trên mỗi trang.
 * @returns {Promise<PaginatedResponse<Product[]>>} Danh sách sản phẩm và thông tin phân trang.
 */
export const getAllProducts = async (
  page = 1,
  limit = 50
): Promise<PaginatedResponse<Product[]>> => {
  try {
    const response = await axiosInstance.get("/products", {
      params: { page, limit },
    });

    const result: ApiResponse<any> = response.data;

    let productsData: Product[] = [];
    let paginationInfo = {
      currentPage: page,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: limit,
    };

    // Xử lý cấu trúc phản hồi từ backend (hỗ trợ cả dạng trực tiếp và lồng nhau)
    if (result.data) {
      if (
        typeof result.data === "object" &&
        "data" in result.data &&
        Array.isArray((result.data as any).data)
      ) {
        productsData = (result.data as any).data;
        paginationInfo = {
          currentPage: (result.data as any).pagination?.currentPage || page,
          totalPages: (result.data as any).pagination?.totalPages || 1,
          totalItems:
            (result.data as any).pagination?.totalItems || productsData.length,
          hasNextPage: (result.data as any).pagination?.hasNextPage || false,
          hasPrevPage: (result.data as any).pagination?.hasPrevPage || false,
          limit: (result.data as any).pagination?.limit || limit,
        };
      } else if (Array.isArray(result.data)) {
        productsData = result.data;
        // Tính toán thông tin phân trang cơ bản nếu backend không trả về đầy đủ
        paginationInfo = {
          currentPage: page,
          totalPages: Math.ceil(productsData.length / limit),
          totalItems: productsData.length,
          hasNextPage: productsData.length === limit,
          hasPrevPage: page > 1,
          limit: limit,
        };
      }
    }

    // Chuyển đổi URL hình ảnh thành URL tuyệt đối
    const transformedProducts = productsData.map((product) => ({
      ...product,
      cover: {
        ...product.cover,
        url: getFullImageUrl(product.cover.url),
      },
    }));

    return {
      data: transformedProducts,
      pagination: paginationInfo,
    };
  } catch (error) {
    throw new Error("Lỗi khi tải danh sách sản phẩm");
  }
};

/**
 * @function getProductsByCategory
 * @description Lấy danh sách sản phẩm theo danh mục với phân trang.
 * @param {number} categoryId - ID của danh mục.
 * @param {number} page - Số trang hiện tại.
 * @param {number} limit - Số lượng sản phẩm trên mỗi trang.
 * @returns {Promise<PaginatedResponse<Product[]>>} Danh sách sản phẩm và thông tin phân trang.
 */
export const getProductsByCategory = async (
  categoryId: number,
  page = 1,
  limit = 50
): Promise<PaginatedResponse<Product[]>> => {
  try {
    const response = await axiosInstance.get(
      `/products/category/${categoryId}`,
      {
        params: { page, limit },
      }
    );

    const result: ApiResponse<any> = response.data;

    let productsData: Product[] = [];
    let paginationInfo = {
      currentPage: page,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: limit,
    };

    // Xử lý tương tự getAllProducts
    if (result.data) {
      if (
        typeof result.data === "object" &&
        "data" in result.data &&
        Array.isArray((result.data as any).data)
      ) {
        productsData = (result.data as any).data;
        paginationInfo = {
          currentPage: (result.data as any).pagination?.currentPage || page,
          totalPages: (result.data as any).pagination?.totalPages || 1,
          totalItems:
            (result.data as any).pagination?.totalItems || productsData.length,
          hasNextPage: (result.data as any).pagination?.hasNextPage || false,
          hasPrevPage: (result.data as any).pagination?.hasPrevPage || false,
          limit: (result.data as any).pagination?.limit || limit,
        };
      } else if (Array.isArray(result.data)) {
        productsData = result.data;
        paginationInfo = {
          currentPage: page,
          totalPages: Math.ceil(productsData.length / limit),
          totalItems: productsData.length,
          hasNextPage: productsData.length === limit,
          hasPrevPage: page > 1,
          limit: limit,
        };
      }
    }

    // Chuyển đổi URL hình ảnh thành URL tuyệt đối
    const transformedProducts = productsData.map((product) => ({
      ...product,
      cover: {
        ...product.cover,
        url: getFullImageUrl(product.cover.url),
      },
    }));

    return {
      data: transformedProducts,
      pagination: paginationInfo,
    };
  } catch (error) {
    throw new Error("Lỗi khi tải danh sách sản phẩm theo danh mục");
  }
};

/**
 * @function getProductDetail
 * @description Lấy chi tiết sản phẩm theo mã sản phẩm.
 * @param {string} productCode - Mã sản phẩm.
 * @returns {Promise<ProductDetail>} Chi tiết sản phẩm.
 */
export const getProductDetail = async (
  productCode: string
): Promise<ProductDetail> => {
  const response = await axiosInstance.get(`/products/${productCode}`);

  const result: ApiResponse<ProductDetail> = response.data;
  const product = result.data;

  // Chuyển đổi URL hình ảnh thành URL tuyệt đối
  return {
    ...product,
    cover: {
      ...product.cover,
      url: getFullImageUrl(product.cover.url),
    },
    gallery:
      product.gallery?.map((image) => ({
        ...image,
        url: getFullImageUrl(image.url),
      })) || [],
  };
};

/**
 * @function deleteProduct
 * @description Xóa sản phẩm theo mã sản phẩm.
 * @param {string} productCode - Mã sản phẩm cần xóa.
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productCode: string): Promise<void> => {
  await axiosInstance.delete(`/products/${productCode}`);
};

/**
 * @function getVariantsByParentCode
 * @description Lấy các biến thể sản phẩm theo mã sản phẩm cha.
 * @param {string} _parentProductCode - Mã sản phẩm cha.
 * @returns {Promise<any[]>} Danh sách các biến thể.
 */
export const getVariantsByParentCode = async (_parentProductCode: string) => {
  return [];
};
