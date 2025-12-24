// services/Orders.ts - Sửa lỗi endpoint
import axiosInstance from "@/shared/lib/axios"; // Import axios instance đã tối ưu của bạn

export interface OrderMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderListItem {
  code: string;
  totalPrice: {
    vi: number;
    ja: number;
  };
  orderStatus: string;
  createdAt: string;
}

export interface ProductVariant {
  label: {
    vi: string;
    ja: string;
  };
  price: {
    vi: {
      original: number;
      discountPercent: number;
    };
    ja: {
      original: number;
      discountPercent: number;
    };
  };
}

export interface OrderProduct {
  productCode: string;
  variant: ProductVariant;
  quantity: number;
}

export interface OrderDetail {
  _id: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
  products: OrderProduct[];
  totalPrice: {
    vi: number;
    ja: number;
  };
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  errorCode: string | null;
}

export interface OrderListResponse {
  items: OrderListItem[];
  meta: OrderMeta;
}

export interface CustomerStat {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: {
    vi: number;
    ja: number;
  };
  lastOrderDate: string;
}

export interface CustomersListResponse {
  items: CustomerStat[];
  meta: OrderMeta;
}

class OrdersService {
  // Lấy danh sách đơn hàng
  async getOrders(page: number = 1, limit: number = 10): Promise<ApiResponse<OrderListResponse>> {
    try {
      const response = await axiosInstance.get(`/orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // Lọc đơn hàng theo trạng thái
  async filterOrdersByStatus(
    orderStatus: string,
    page: number = 1
  ): Promise<ApiResponse<OrderListResponse>> {
    try {
      const response = await axiosInstance.get(
        `/orders/filter?orderStatus=${encodeURIComponent(
          orderStatus
        )}&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Error filtering orders by status:", error);
      throw error;
    }
  }

  // Tìm kiếm đơn hàng theo mã code
  async searchOrdersByCode(
    code: string,
    page: number = 1
  ): Promise<ApiResponse<OrderListResponse>> {
    try {
      const response = await axiosInstance.get(
        `/orders/search?code=${encodeURIComponent(code)}&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching orders by code:", error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng - SỬA LỖI ENDPOINT
  async getOrderDetail(orderCode: string): Promise<ApiResponse<OrderDetail>> {
    try {
      // Sửa từ `/orders/${orderCode}` thành `/orders/:orderCode`
      // theo tài liệu BE: </orders/:productCode> nhưng có thể là typo, nên dùng orderCode
      const response = await axiosInstance.get(
        `/orders/${encodeURIComponent(orderCode)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(
    orderCode: string,
    orderStatus: string
  ): Promise<ApiResponse<OrderDetail>> {
    try {
      const response = await axiosInstance.patch(
        `/orders/${encodeURIComponent(orderCode)}`,
        { orderStatus }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // Xóa đơn hàng
  async deleteOrder(orderCode: string): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.delete(
        `/orders/${encodeURIComponent(orderCode)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  // Lấy thống kê khách hàng
  async getCustomersStats(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<CustomersListResponse>> {
    try {
      const response = await axiosInstance.get(
        `/orders/customers?page=${page}&limit=${limit}${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      throw error;
    }
  }

  // Test connection đơn giản
  async testConnection(): Promise<{
    success: boolean;
    error?: string;
    details?: any;
  }> {
    try {
      // console.log(
      //   "Testing API connection to:",
      //   `${axiosInstance.defaults.baseURL}/orders?page=1`
      // );

      const response = await axiosInstance.get("/orders?page=1");

      return {
        success: true,
        details: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
        },
      };
    } catch (error: any) {
      console.error("Connection test failed:", error);

      return {
        success: false,
        error: error.message || "Unknown error",
        details: {
          originalError: error,
          status: error.status,
          response: error.response?.data,
          baseURL: axiosInstance.defaults.baseURL,
        },
      };
    }
  }
}

export const ordersService = new OrdersService();
