// hooks/useOrders.ts - Phiên bản sửa lỗi với xử lý thông báo thân thiện
import { useState, useEffect, useCallback } from "react";
import {
  ordersService,
  OrderListItem,
  OrderDetail,
  OrderMeta,
} from "../services/Orders";

// Thêm event emitter để đồng bộ state
class OrderEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

const orderEvents = new OrderEventEmitter();

// Helper function để kiểm tra response hợp lệ
const isValidResponse = (response: any): boolean => {
  return (
    response &&
    typeof response === "object" &&
    response.data &&
    response.data.items &&
    Array.isArray(response.data.items)
  );
};

// Helper function để kiểm tra response rỗng (không có kết quả)
const isEmptyResponse = (response: any): boolean => {
  // Trường hợp API trả về {}
  if (
    !response ||
    (typeof response === "object" && Object.keys(response).length === 0)
  ) {
    return true;
  }

  // Trường hợp API trả về { data: { items: [] } }
  if (
    response?.data?.items &&
    Array.isArray(response.data.items) &&
    response.data.items.length === 0
  ) {
    return true;
  }

  return false;
};

interface UseOrdersState {
  orders: OrderListItem[];
  loading: boolean;
  error: string | null;
  meta: OrderMeta | null;
}

interface UseOrdersReturn extends UseOrdersState {
  fetchOrders: (page?: number) => Promise<void>;
  filterByStatus: (status: string, page?: number) => Promise<void>;
  searchByCode: (code: string, page?: number) => Promise<void>;
  refreshOrders: () => Promise<void>;
  clearError: () => void;
  updateOrderInList: (
    code: string,
    updatedOrder: Partial<OrderListItem>
  ) => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [state, setState] = useState<UseOrdersState>({
    orders: [],
    loading: false,
    error: null,
    meta: null,
  });

  const [currentFilter, setCurrentFilter] = useState<{
    type: "all" | "status" | "search";
    value?: string;
    page: number;
  }>({
    type: "all",
    page: 1,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Hàm cập nhật đơn hàng trong danh sách mà không cần fetch lại
  const updateOrderInList = useCallback(
    (code: string, updatedOrder: Partial<OrderListItem>) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((order) =>
          order.code === code ? { ...order, ...updatedOrder } : order
        ),
      }));
    },
    []
  );

  const fetchOrders = useCallback(async (page: number = 1) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await ordersService.getOrders(page);

      if (isValidResponse(response)) {
        setState((prev) => ({
          ...prev,
          orders: response.data.items,
          meta: response.data.meta,
          loading: false,
        }));
        setCurrentFilter({ type: "all", page });
      } else if (isEmptyResponse(response)) {
        // Trường hợp không có dữ liệu - không phải lỗi
        setState((prev) => ({
          ...prev,
          orders: [],
          meta: null,
          loading: false,
          error: null,
        }));
        setCurrentFilter({ type: "all", page });
      } else {
        // Log chi tiết cho developer nhưng không hiển thị cho user
        console.warn("Unexpected response structure from getOrders:", {
          hasData: !!response?.data,
          hasItems: !!response?.data?.items,
          isItemsArray: Array.isArray(response?.data?.items),
          responseKeys: response ? Object.keys(response) : [],
        });

        setState((prev) => ({
          ...prev,
          error: "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.",
          loading: false,
          orders: [],
          meta: null,
        }));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy danh sách đơn hàng";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
        orders: [],
        meta: null,
      }));
      console.error("Fetch orders error:", error);
    }
  }, []);

  const filterByStatus = useCallback(
    async (status: string, page: number = 1) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await ordersService.filterOrdersByStatus(status, page);

        if (isValidResponse(response)) {
          setState((prev) => ({
            ...prev,
            orders: response.data.items,
            meta: response.data.meta,
            loading: false,
          }));
          setCurrentFilter({ type: "status", value: status, page });
        } else if (isEmptyResponse(response)) {
          // Trường hợp không có kết quả lọc - không phải lỗi
          setState((prev) => ({
            ...prev,
            orders: [],
            meta: null,
            loading: false,
            error: null,
          }));
          setCurrentFilter({ type: "status", value: status, page });
        } else {
          console.warn(
            "Unexpected response structure from filterOrdersByStatus:",
            {
              status,
              page,
              hasData: !!response?.data,
              hasItems: !!response?.data?.items,
              isItemsArray: Array.isArray(response?.data?.items),
              responseKeys: response ? Object.keys(response) : [],
            }
          );

          setState((prev) => ({
            ...prev,
            error: "Không thể lọc đơn hàng. Vui lòng thử lại sau.",
            loading: false,
            orders: [],
            meta: null,
          }));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lọc đơn hàng";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          orders: [],
          meta: null,
        }));
        console.error("Filter orders error:", error);
      }
    },
    []
  );

  const searchByCode = useCallback(async (code: string, page: number = 1) => {
    if (!code || code.trim().length === 0) {
      setState((prev) => ({
        ...prev,
        error: null,
        orders: [],
        meta: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await ordersService.searchOrdersByCode(
        code.trim(),
        page
      );

      if (isValidResponse(response)) {
        // Có kết quả tìm kiếm hợp lệ
        setState((prev) => ({
          ...prev,
          orders: response.data.items,
          meta: response.data.meta,
          loading: false,
          error: null,
        }));
        setCurrentFilter({ type: "search", value: code.trim(), page });
      } else if (isEmptyResponse(response)) {
        // Không tìm thấy kết quả - không phải lỗi
        setState((prev) => ({
          ...prev,
          orders: [],
          meta: response?.data?.meta || null,
          loading: false,
          error: null,
        }));
        setCurrentFilter({ type: "search", value: code.trim(), page });
      } else {
        // Log thông tin để debug nhưng không gây lỗi console
        console.warn("Unexpected response structure from searchOrdersByCode:", {
          searchCode: code.trim(),
          page,
          hasData: !!response?.data,
          hasItems: !!response?.data?.items,
          isItemsArray: Array.isArray(response?.data?.items),
          responseKeys: response ? Object.keys(response) : [],
          responseType: typeof response,
        });

        setState((prev) => ({
          ...prev,
          error: "Mã đơn hàng không hợp lệ.",
          loading: false,
          orders: [],
          meta: null,
        }));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tìm kiếm đơn hàng";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
        orders: [],
        meta: null,
      }));
      console.error("Search orders error:", error);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    const { type, value, page } = currentFilter;

    try {
      switch (type) {
        case "status":
          if (value) await filterByStatus(value, page);
          break;
        case "search":
          if (value) await searchByCode(value, page);
          break;
        default:
          await fetchOrders(page);
      }
    } catch (error) {
      console.error("Refresh orders error:", error);
    }
  }, [currentFilter, fetchOrders, filterByStatus, searchByCode]);

  // Lắng nghe sự kiện cập nhật từ modal
  useEffect(() => {
    const handleOrderUpdated = (data: {
      code: string;
      orderStatus: string;
    }) => {
      updateOrderInList(data.code, { orderStatus: data.orderStatus });
    };

    const handleOrderDeleted = (data: { code: string }) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.filter((order) => order.code !== data.code),
      }));
      // Cập nhật meta nếu cần
      setState((prev) => ({
        ...prev,
        meta: prev.meta ? { ...prev.meta, total: prev.meta.total - 1 } : null,
      }));
    };

    orderEvents.on("order:updated", handleOrderUpdated);
    orderEvents.on("order:deleted", handleOrderDeleted);

    return () => {
      orderEvents.off("order:updated", handleOrderUpdated);
      orderEvents.off("order:deleted", handleOrderDeleted);
    };
  }, [updateOrderInList]);

  // Load initial data
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    ...state,
    fetchOrders,
    filterByStatus,
    searchByCode,
    refreshOrders,
    clearError,
    updateOrderInList,
  };
};

interface UseOrderDetailState {
  order: OrderDetail | null;
  loading: boolean;
  error: string | null;
}

interface UseOrderDetailReturn extends UseOrderDetailState {
  fetchOrderDetail: (code: string) => Promise<void>;
  updateOrderStatus: (code: string, status: string) => Promise<void>;
  deleteOrder: (code: string) => Promise<void>;
  clearOrder: () => void;
  clearError: () => void;
}

export const useOrderDetail = (): UseOrderDetailReturn => {
  const [state, setState] = useState<UseOrderDetailState>({
    order: null,
    loading: false,
    error: null,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const fetchOrderDetail = useCallback(async (code: string) => {
    if (!code || code.trim().length === 0) {
      setState((prev) => ({
        ...prev,
        error: "Mã đơn hàng không hợp lệ",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await ordersService.getOrderDetail(code.trim());

      if (response?.data) {
        setState((prev) => ({
          ...prev,
          order: response.data,
          loading: false,
        }));
      } else if (isEmptyResponse(response)) {
        // Không tìm thấy đơn hàng
        setState((prev) => ({
          ...prev,
          error: "Không tìm thấy đơn hàng này",
          loading: false,
          order: null,
        }));
      } else {
        console.warn("Unexpected response structure from getOrderDetail:", {
          orderCode: code.trim(),
          hasData: !!response?.data,
          responseKeys: response ? Object.keys(response) : [],
          responseType: typeof response,
        });

        setState((prev) => ({
          ...prev,
          error: "Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.",
          loading: false,
          order: null,
        }));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy chi tiết đơn hàng";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
        order: null,
      }));
      console.error("Fetch order detail error:", error);
    }
  }, []);

  const updateOrderStatus = useCallback(
    async (code: string, status: string) => {
      if (!code || code.trim().length === 0) {
        throw new Error("Mã đơn hàng không hợp lệ");
      }

      if (!status || status.trim().length === 0) {
        throw new Error("Trạng thái không hợp lệ");
      }

      // Validate status values theo backend enum
      const validStatuses = ["PENDING", "CONFIRMED", "COMPLETE", "CANCELLED"];
      if (!validStatuses.includes(status)) {
        throw new Error(`Trạng thái không hợp lệ: ${status}`);
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await ordersService.updateOrderStatus(
          code.trim(),
          status
        );

        if (response?.data) {
          setState((prev) => ({
            ...prev,
            order: response.data,
            loading: false,
          }));

          // Phát sự kiện để cập nhật danh sách
          orderEvents.emit("order:updated", {
            code: code.trim(),
            orderStatus: status,
          });
        } else {
          console.warn(
            "Unexpected response structure from updateOrderStatus:",
            {
              orderCode: code.trim(),
              status,
              hasData: !!response?.data,
              responseKeys: response ? Object.keys(response) : [],
            }
          );
          throw new Error("Không thể cập nhật trạng thái đơn hàng");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
        console.error("Update order status error:", error);
        throw error;
      }
    },
    []
  );

  const deleteOrder = useCallback(async (code: string) => {
    if (!code || code.trim().length === 0) {
      throw new Error("Mã đơn hàng không hợp lệ");
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await ordersService.deleteOrder(code.trim());

      if (response?.message) {
        setState((prev) => ({
          ...prev,
          order: null,
          loading: false,
        }));

        // Phát sự kiện để cập nhật danh sách
        orderEvents.emit("order:deleted", { code: code.trim() });
      } else {
        console.warn("Unexpected response structure from deleteOrder:", {
          orderCode: code.trim(),
          hasMessage: !!response?.message,
          responseKeys: response ? Object.keys(response) : [],
        });
        throw new Error("Không thể xóa đơn hàng");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa đơn hàng";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      console.error("Delete order error:", error);
      throw error;
    }
  }, []);

  const clearOrder = useCallback(() => {
    setState({
      order: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchOrderDetail,
    updateOrderStatus,
    deleteOrder,
    clearOrder,
    clearError,
  };
};

// Export event emitter để có thể sử dụng ở component khác nếu cần
export { orderEvents };
