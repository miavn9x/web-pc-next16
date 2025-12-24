
import axiosInstance from "@/shared/lib/axios";

export interface Coupon {
  _id: string;
  code: string;
  name: { vi: string; ja: string };
  type: string; // 'percent', 'fixed'
  value: { vi: number; ja: number };
  limit: number;
  used: number;
  isActive: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const couponService = {
  // Lấy danh sách coupons
  getAll: async () => {
    try {
      const response = await axiosInstance.get<any>("/coupons");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching coupons:", error);
      throw error;
    }
  },

  // Lấy chi tiết coupon
  getById: async (id: string) => {
    try {
      const response = await axiosInstance.get<any>(`/coupons/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching coupon ${id}:`, error);
      throw error;
    }
  },

  // Lấy coupon theo mã code
  getByCode: async (code: string) => {
    try {
      // Need a new endpoint in backend or filter?
      // Backend CouponController doesn't have specific getByCode endpoint exposed publicly as /coupons/code/:code
      // But we can search? Backend `findAll` returns all. 
      // Actually, standard practice for client: POST /coupons/apply or GET /coupons?code=...
      // The user wants to "apply" code. 
      // Let's check backend controller again. 
      // Backend controller: findAll, findOne(id), create, update, remove.
      // It does NOT have findByCode exposed.
      // I should add `findByCode` endpoint to Backend Controller first!
      
      // Wait, I am in frontend service file. 
      // I'll assume I'll add the backend point.
      // Let's implement this assuming I add `GET /coupons/code/:code`
      const response = await axiosInstance.get<any>(`/coupons/code/${encodeURIComponent(code)}`);
      return response.data.data;
    } catch (error) {
        // If not found, backend throws 404 which axios catches
        throw error;
    }
  },

  // Tạo coupon mới
  create: async (data: Partial<Coupon>) => {
    try {
      const response = await axiosInstance.post<any>("/coupons", data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating coupon:", error);
      throw error;
    }
  },

  // Cập nhật coupon
  update: async (id: string, data: Partial<Coupon>) => {
    try {
      const response = await axiosInstance.put<any>(`/coupons/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating coupon ${id}:`, error);
      throw error;
    }
  },

  // Xóa coupon
  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete<any>(`/coupons/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting coupon ${id}:`, error);
      throw error;
    }
  },
};
