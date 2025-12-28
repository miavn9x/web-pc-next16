import axiosInstance from "@/shared/lib/axios";
import type {
  Category,
  PriceRange,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types";

/**
 * Response từ backend
 */
interface ApiResponse<T> {
  message: string;
  data: T;
  errorCode: string | null;
}

/**
 * Lấy tất cả danh mục (flat list)
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get("/products/categories");
    const result: ApiResponse<Category[]> = response.data;
    return result.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Lỗi khi tải danh sách danh mục");
  }
};

/**
 * Lấy cây danh mục phân cấp
 */
export const getCategoryTree = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get("/products/categories/tree");
    const result: ApiResponse<Category[]> = response.data;
    return result.data || [];
  } catch (error) {
    console.error("Error fetching category tree:", error);
    throw new Error("Lỗi khi tải cây danh mục");
  }
};

/**
 * Lấy chi tiết một danh mục theo code
 */
export const getCategoryByCode = async (code: string): Promise<Category> => {
  try {
    const response = await axiosInstance.get(`/products/categories/${code}`);
    const result: ApiResponse<Category> = response.data;
    return result.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Lỗi khi tải danh mục");
  }
};

/**
 * Tạo danh mục mới
 */
export const createCategory = async (
  data: CreateCategoryDto
): Promise<Category> => {
  try {
    const response = await axiosInstance.post("/products/categories", data);
    const result: ApiResponse<Category> = response.data;

    if (result.errorCode) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error: any) {
    console.error("Error creating category:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi tạo danh mục"
    );
  }
};

/**
 * Cập nhật danh mục theo code
 */
export const updateCategory = async (
  code: string,
  data: UpdateCategoryDto
): Promise<Category> => {
  try {
    const response = await axiosInstance.patch(
      `/products/categories/${code}`,
      data
    );
    const result: ApiResponse<Category> = response.data;

    if (result.errorCode) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error: any) {
    console.error("Error updating category:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Lỗi khi cập nhật danh mục"
    );
  }
};

/**
 * Xóa danh mục theo code (cascade delete)
 */
export const deleteCategory = async (code: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/categories/${code}`);
  } catch (error: any) {
    console.error("Error deleting category:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Lỗi khi xóa danh mục"
    );
  }
};

/**
 * Lấy danh sách ancestors (chuỗi cha) của một danh mục
 */
export const getCategoryAncestors = async (
  code: string
): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get(
      `/products/categories/${code}/ancestors`
    );
    const result: ApiResponse<Category[]> = response.data;
    return result.data || [];
  } catch (error) {
    console.error("Error fetching ancestors:", error);
    throw new Error("Lỗi khi tải chuỗi danh mục cha");
  }
};

/**
 * Lấy danh sách descendants (tất cả con) của một danh mục
 */
export const getCategoryDescendants = async (
  code: string
): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get(
      `/products/categories/${code}/descendants`
    );
    const result: ApiResponse<Category[]> = response.data;
    return result.data || [];
  } catch (error) {
    console.error("Error fetching descendants:", error);
    throw new Error("Lỗi khi tải danh mục con");
  }
};
