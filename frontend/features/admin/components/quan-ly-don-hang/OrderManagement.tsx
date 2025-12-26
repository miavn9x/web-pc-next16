import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  RefreshCw,
  AlertCircle,
  X,
  Copy,
  Check,
} from "lucide-react";

// Import hooks thật
import { useOrders, useOrderDetail } from "./hooks/orders";
import { useNotification } from "../../contexts/NotificationContext";

// Type definitions
type Language = "vi" | "ja";

interface LocalizedText {
  vi: string;
  ja: string;
}

interface StatusOption {
  value: string;
  label: LocalizedText;
}

const OrderManagement = () => {
  const { refreshPendingOrders } = useNotification();
  const [searchCode, setSearchCode] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [language, setLanguage] = useState<Language>("vi");
  const [showOrderDetail, setShowOrderDetail] = useState<boolean>(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string>("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");

  // States cho modal cập nhật trạng thái
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [statusModalOrderCode, setStatusModalOrderCode] = useState<string>("");
  const [statusModalCurrentStatus, setStatusModalCurrentStatus] =
    useState<string>("");
  const [statusModalNewStatus, setStatusModalNewStatus] = useState<string>("");
  const [statusUpdateLoading, setStatusUpdateLoading] =
    useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCustomerInfo = () => {
    if (!orderDetail) return;
    const info = [
      language === "vi" ? "THÔNG TIN KHÁCH HÀNG" : "顧客情報",
      `Email: ${orderDetail.email}`,
      `${language === "vi" ? "Số điện thoại" : "電話番号"}: ${orderDetail.phone}`,
      `${language === "vi" ? "Địa chỉ" : "住所"}: ${orderDetail.address}`,
      orderDetail.note ? `${language === "vi" ? "Ghi chú" : "注記"}: ${orderDetail.note}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    handleCopy(info, 'customer_info');
  };

  const handleCopyOrderInfo = () => {
    if (!orderDetail) return;
    const info = [
      language === "vi" ? "THÔNG TIN ĐƠN HÀNG" : "注文情報",
      `${language === "vi" ? "Mã đơn hàng" : "注文番号"}: ${orderDetail.code}`,
      `${language === "vi" ? "Ngày tạo" : "作成日"}: ${formatDate(orderDetail.createdAt)}`,
      `${language === "vi" ? "Trạng thái" : "ステータス"}: ${
        statusOptions.find((s) => s.value === selectedOrderStatus)?.label[language] || selectedOrderStatus
      }`,
      `${language === "vi" ? "Tổng tiền" : "合計金額"}: ${formatPrice(orderDetail.totalPrice[language], language)}`,
    ].join("\n\n");
    handleCopy(info, 'order_info');
  };

  const handleCopyProducts = () => {
    if (!orderDetail) return;
    const text = orderDetail.products
      .map((p) => {
        const originalPrice = p.variant.price[language].original;
        const discountPercent = p.variant.price[language].discountPercent;
        const finalPrice = calculateDiscountedPrice(originalPrice, discountPercent);
        
        return [
           `${language === "vi" ? "Mã sản phẩm" : "商品コード"}: ${p.productCode}`,
           `${language === "vi" ? "Phân loại" : "バリエーション"}: ${p.variant.label[language]}`,
           `${language === "vi" ? "Số lượng" : "数量"}: ${p.quantity}`,
           `${formatPrice(finalPrice, language)}`,
           discountPercent > 0 ? `${formatPrice(originalPrice, language)}` : ""
        ].filter(Boolean).join("\n\n");
      })
      .join("\n\n--------------------------------\n\n");
    handleCopy(text, 'products');
  };

  // Sử dụng hooks thật
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    meta,
    fetchOrders,
    filterByStatus,
    searchByCode,
    refreshOrders,
  } = useOrders();

  const {
    order: orderDetail,
    loading: detailLoading,
    error: detailError,
    fetchOrderDetail,
    updateOrderStatus,
    deleteOrder,
    clearOrder,
  } = useOrderDetail();

  // Cập nhật status options theo Backend enum
  const statusOptions: StatusOption[] = [
    { value: "all", label: { vi: "Tất cả", ja: "すべて" } },
    { value: "PENDING", label: { vi: "Chờ xử lý", ja: "処理待ち" } },
    { value: "CONFIRMED", label: { vi: "Đã xác nhận", ja: "確認済み" } },
    { value: "COMPLETE", label: { vi: "Hoàn thành", ja: "完了" } },
    { value: "CANCELLED", label: { vi: "Đã hủy", ja: "キャンセル済み" } },
  ];

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      COMPLETE: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatPrice = (price: number, lang: Language): string => {
    if (lang === "vi") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    }
    return `¥${price.toLocaleString()}`;
  };

  const formatMixedPrice = (price: { vi: number; ja: number }): string => {
    const parts = [];
    if (price.vi > 0) parts.push(formatPrice(price.vi, "vi"));
    if (price.ja > 0) parts.push(formatPrice(price.ja, "ja"));
    return parts.length > 0 ? parts.join(" + ") : formatPrice(0, "vi");
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(
      language === "vi" ? "vi-VN" : "ja-JP",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const handleSearch = async () => {
    if (searchCode.trim()) {
      try {
        await searchByCode(searchCode.trim(), 1);
        setCurrentPage(1);
        setFilterStatus("all"); // Reset filter khi search
      } catch  {
        // Handle search error silently or show user-friendly message
        alert(language === "vi" ? "Lỗi tìm kiếm" : "検索エラー");
      }
    } else {
      // Nếu không có search code, reset về danh sách tất cả hoặc filter hiện tại
      if (filterStatus !== "all") {
        await filterByStatus(filterStatus, 1);
      } else {
        await fetchOrders(1);
      }
      setCurrentPage(1);
    }
  };

  const handleFilterChange = async (status: string) => {
    setFilterStatus(status);
    setSearchCode(""); // Clear search khi filter
    setCurrentPage(1);

    try {
      if (status === "all") {
        await fetchOrders(1);
      } else {
        await filterByStatus(status, 1);
      }
    } catch  {
      alert(language === "vi" ? "Lỗi lọc trạng thái" : "フィルタエラー");
    }
  };

  const handleViewDetail = async (orderCode: string, orderStatus: string) => {
    setSelectedOrderCode(orderCode);
    setSelectedOrderStatus(orderStatus);
    setShowOrderDetail(true);
    try {
      await fetchOrderDetail(orderCode);
    } catch  {
      alert(language === "vi" ? "Lỗi lấy chi tiết đơn hàng" : "注文詳細エラー");
    }
  };

  // Hàm mở modal cập nhật trạng thái
  const handleOpenStatusModal = (orderCode: string, currentStatus: string) => {
    setStatusModalOrderCode(orderCode);
    setStatusModalCurrentStatus(currentStatus);
    setStatusModalNewStatus(currentStatus);
    setShowStatusModal(true);
  };

  // Hàm đóng modal cập nhật trạng thái
  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setStatusModalOrderCode("");
    setStatusModalCurrentStatus("");
    setStatusModalNewStatus("");
    setStatusUpdateLoading(false);
  };

  // Hàm cập nhật trạng thái từ modal
  const handleStatusModalUpdate = async () => {
    if (statusModalNewStatus === statusModalCurrentStatus) {
      handleCloseStatusModal();
      return;
    }

    setStatusUpdateLoading(true);
    try {
      await updateOrderStatus(statusModalOrderCode, statusModalNewStatus);
      // Refresh danh sách đơn hàng
      await refreshOrders();
      // Refresh notification badge
      await refreshPendingOrders();
      // Hiển thị thông báo thành công
      alert(
        language === "vi"
          ? "Cập nhật trạng thái thành công!"
          : "ステータス更新成功！"
      );
      handleCloseStatusModal();
    } catch  {
      alert(
        language === "vi"
          ? "Lỗi cập nhật trạng thái! Vui lòng thử lại."
          : "ステータス更新エラー！もう一度お試しください。"
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleUpdateStatus = async (code: string, newStatus: string) => {
    try {
      await updateOrderStatus(code, newStatus);
      // Refresh danh sách đơn hàng
      await refreshOrders();
      // Refresh notification badge
      await refreshPendingOrders();
      // Cập nhật lại detail nếu đang xem
      if (showOrderDetail && selectedOrderCode === code) {
        await fetchOrderDetail(code);
      }
      // Hiển thị thông báo thành công
      alert(
        language === "vi"
          ? "Cập nhật trạng thái thành công!"
          : "ステータス更新成功！"
      );
      // Đóng modal sau khi cập nhật thành công
      setShowOrderDetail(false);
      clearOrder();
    } catch  {
      alert(
        language === "vi"
          ? "Lỗi cập nhật trạng thái! Vui lòng thử lại."
          : "ステータス更新エラー！もう一度お試しください。"
      );
    }
  };

  const handleDeleteOrder = async (code: string) => {
    if (
      confirm(
        language === "vi"
          ? "Bạn có chắc muốn xóa đơn hàng này?"
          : "この注文を削除してもよろしいですか？"
      )
    ) {
      try {
        await deleteOrder(code);
        // Refresh danh sách đơn hàng
        await refreshOrders();
        // Đóng modal nếu đang xem chi tiết đơn hàng này
        if (selectedOrderCode === code) {
          setShowOrderDetail(false);
          setSelectedOrderStatus(""); // Reset status
          clearOrder();
        }
        // Hiển thị thông báo thành công
        alert(
          language === "vi" ? "Xóa đơn hàng thành công!" : "注文削除成功！"
        );
      } catch  {
        alert(
          language === "vi"
            ? "Lỗi xóa đơn hàng! Vui lòng thử lại."
            : "注文削除エラー！もう一度お試しください。"
        );
      }
    }
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);

    try {
      if (searchCode.trim()) {
        await searchByCode(searchCode.trim(), newPage);
      } else if (filterStatus !== "all") {
        await filterByStatus(filterStatus, newPage);
      } else {
        await fetchOrders(newPage);
      }
    } catch  {
      alert(language === "vi" ? "Lỗi chuyển trang" : "ページエラー");
    }
  };

  // Xử lý Enter key trong search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchCode("");
    if (filterStatus !== "all") {
      handleFilterChange(filterStatus);
    } else {
      fetchOrders(1);
    }
  };

  // Thêm function để tính giá sau discount
  const calculateDiscountedPrice = (
    originalPrice: number,
    discountPercent: number
  ): number => {
    return originalPrice * (1 - discountPercent / 100);
  };

  // Thêm function để đóng modal khi click vào backdrop
  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (showStatusModal) {
        handleCloseStatusModal();
      }
      if (showOrderDetail) {
        setShowOrderDetail(false);
        clearOrder();
      }
    }
  };

  // Modal cập nhật trạng thái - Tối ưu responsive
  const StatusUpdateModal = () => {
    if (!showStatusModal) return null;

    return (
      <div
        id="modal-status-update"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleModalBackdropClick}
      >
        <div className="bg-white rounded-lg w-full max-w-md mx-auto">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b" id="status-update-header">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === "vi"
                ? "Cập nhật trạng thái đơn hàng"
                : "注文ステータス更新"}
            </h3>
            <button
              onClick={handleCloseStatusModal}
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={statusUpdateLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "vi" ? "Mã đơn hàng" : "注文番号"}
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-900 font-medium text-sm" id="status-update-order-code">
                {statusModalOrderCode}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "vi" ? "Trạng thái hiện tại" : "現在のステータス"}
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-lg" id="status-update-current">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    statusModalCurrentStatus
                  )}`}
                >
                  {
                    statusOptions.find(
                      (s) => s.value === statusModalCurrentStatus
                    )?.label[language]
                  }
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "vi" ? "Trạng thái mới" : "新しいステータス"}
              </label>
              <select
                id="status-update-new"
                value={statusModalNewStatus}
                onChange={(e) => setStatusModalNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={statusUpdateLoading}
              >
                {statusOptions.slice(1).map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label[language]}
                  </option>
                ))}
              </select>
            </div>

            {statusModalNewStatus !== statusModalCurrentStatus && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  {language === "vi"
                    ? `Đơn hàng sẽ được cập nhật từ &quot;${
                        statusOptions.find(
                          (s) => s.value === statusModalCurrentStatus
                        )?.label[language]
                      }&quot; sang &quot;${
                        statusOptions.find(
                          (s) => s.value === statusModalNewStatus
                        )?.label[language]
                      }&quot;`
                    : `注文を「${
                        statusOptions.find(
                          (s) => s.value === statusModalCurrentStatus
                        )?.label[language]
                      }」から「${
                        statusOptions.find(
                          (s) => s.value === statusModalNewStatus
                        )?.label[language]
                      }」に更新します`}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t">
            <button
              id="btn-cancel-status"
              onClick={handleCloseStatusModal}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={statusUpdateLoading}
            >
              {language === "vi" ? "Hủy" : "キャンセル"}
            </button>
            <button
              id="btn-save-status"
              onClick={handleStatusModalUpdate}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={
                statusUpdateLoading ||
                statusModalNewStatus === statusModalCurrentStatus
              }
            >
              {statusUpdateLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {language === "vi" ? "Cập nhật" : "更新"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal chi tiết đơn hàng - Tối ưu responsive
  const OrderDetailModal = () => {
    if (!orderDetail) return null;

    return (
      <div
        id="modal-order-detail"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center  z-9999 p-4 overflow-y-auto"
        onClick={handleModalBackdropClick}
      >
        <div className="bg-white rounded-lg w-full max-w-4xl my-4 min-h-0">
          <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center rounded-t-lg" id="detail-header">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-4">
              {language === "vi" ? "Chi tiết đơn hàng" : "注文詳細"} -{" "}
              {orderDetail.code}
            </h2>
            <button
              id="detail-close"
              onClick={() => {
                setShowOrderDetail(false);
                clearOrder();
              }}
              className="text-gray-500 hover:text-gray-700 p-1 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {detailLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">
                {language === "vi" ? "Đang tải..." : "読み込み中..."}
              </p>
            </div>
          ) : detailError ? (
            <div className="p-6 text-center text-red-600">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{detailError}</p>
              <button
                onClick={() => fetchOrderDetail(selectedOrderCode)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {language === "vi" ? "Thử lại" : "再試行"}
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Thông tin khách hàng và đơn hàng */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4" id="detail-customer-section">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {language === "vi" ? "Thông tin khách hàng" : "顧客情報"}
                    <button
                        onClick={handleCopyCustomerInfo}
                        className="ml-2 text-gray-400 hover:text-blue-500 inline-flex items-center gap-1 active:scale-95 transition-transform"
                        title={language === "vi" ? "Sao chép thông tin" : "情報をコピー"}
                    >
                        {copiedId === "customer_info" ? (
                        <Check className="w-4 h-4 text-green-500" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </button>
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email:</p>
                        <div className="flex items-center gap-2">
                            <a href={`mailto:${orderDetail.email}`} className="font-medium break-all hover:text-blue-600 hover:underline">
                                {orderDetail.email}
                            </a>
                            <button
                                onClick={() => handleCopy(orderDetail.email, "email")}
                                className="text-gray-400 hover:text-blue-500 shrink-0"
                                title={language === "vi" ? "Sao chép" : "コピー"}
                            >
                                {copiedId === "email" ? (
                                <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {language === "vi" ? "Số điện thoại" : "電話番号"}:
                        </p>
                        <p className="font-medium flex items-center gap-2">
                            <a href={`tel:${orderDetail.phone}`} className="hover:text-blue-600 hover:underline">
                                {orderDetail.phone}
                            </a>
                             <button
                                onClick={() => handleCopy(orderDetail.phone, "phone")}
                                className="text-gray-400 hover:text-blue-500"
                                title={language === "vi" ? "Sao chép" : "コピー"}
                              >
                                {copiedId === "phone" ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {language === "vi" ? "Địa chỉ" : "住所"}:
                        </p>
                        <p className="font-medium flex items-center gap-2">
                            {orderDetail.address}
                             <button
                                onClick={() => handleCopy(orderDetail.address, "address")}
                                className="text-gray-400 hover:text-blue-500"
                                title={language === "vi" ? "Sao chép" : "コピー"}
                              >
                                {copiedId === "address" ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                        </p>
                      </div>
                    </div>
                    {orderDetail.note && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === "vi" ? "Ghi chú" : "注記"}:
                        </p>
                        <p className="font-medium">{orderDetail.note}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4" id="detail-order-section">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {language === "vi" ? "Thông tin đơn hàng" : "注文情報"}
                    <button
                        onClick={handleCopyOrderInfo}
                        className="ml-2 text-gray-400 hover:text-blue-500 inline-flex items-center gap-1 active:scale-95 transition-transform"
                        title={language === "vi" ? "Sao chép thông tin" : "情報をコピー"}
                    >
                        {copiedId === "order_info" ? (
                        <Check className="w-4 h-4 text-green-500" />
                        ) : (
                        <Copy className="w-4 h-4" />
                        )}
                    </button>
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === "vi" ? "Mã đơn hàng" : "注文番号"}:
                      </p>
                      <p className="font-medium flex items-center gap-2">
                        {orderDetail.code}
                        <button
                          onClick={() => handleCopy(orderDetail.code, "code")}
                          className="text-gray-400 hover:text-blue-500"
                          title={language === "vi" ? "Sao chép" : "コピー"}
                        >
                          {copiedId === "code" ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {language === "vi" ? "Ngày tạo" : "作成日"}:
                        </p>
                        <p className="font-medium flex items-center gap-2">
                          {formatDate(orderDetail.createdAt)}
                           <button
                            onClick={() => handleCopy(formatDate(orderDetail.createdAt), "date")}
                            className="text-gray-400 hover:text-blue-500"
                            title={language === "vi" ? "Sao chép" : "コピー"}
                          >
                            {copiedId === "date" ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === "vi" ? "Trạng thái" : "ステータス"}:
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          selectedOrderStatus
                        )}`}
                      >
                        {statusOptions.find(
                          (s) => s.value === selectedOrderStatus
                        )?.label[language] || selectedOrderStatus}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {language === "vi" ? "Tổng tiền" : "合計金額"}:
                        </p>
                        <p className="text-lg font-bold text-green-600 flex items-center gap-2">
                          {formatMixedPrice(orderDetail.totalPrice)}
                           <button
                              onClick={() => handleCopy(
                                `${orderDetail.totalPrice.vi > 0 ? formatPrice(orderDetail.totalPrice.vi, 'vi') : ''} ${orderDetail.totalPrice.ja > 0 ? formatPrice(orderDetail.totalPrice.ja, 'ja') : ''}`.trim(), 
                                "total"
                              )}
                              className="text-gray-400 hover:text-blue-500"
                              title={language === "vi" ? "Sao chép" : "コピー"}
                            >
                              {copiedId === "total" ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div id="detail-products-section">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === "vi" ? "Sản phẩm đã đặt" : "注文商品"}
                   <button
                      onClick={handleCopyProducts}
                      className="ml-2 text-gray-400 hover:text-blue-500 inline-flex items-center gap-1 active:scale-95 transition-transform"
                      title={language === "vi" ? "Sao chép danh sách" : "リストをコピー"}
                    >
                      {copiedId === "products" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                </h3>
                <div className="space-y-4">
                  {orderDetail.products.map((product, index) => {
                     // Determine locked locale based on price
                    const isVi = product.variant.price.vi.original > 0;
                    const isJa = product.variant.price.ja.original > 0;
                    
                    let displayLocale: Language = language; 
                    if (isVi && !isJa) displayLocale = 'vi';
                    else if (!isVi && isJa) displayLocale = 'ja';
                    // If both are > 0, we stick to current language or could show both. 
                    // For legacy support, defaulting to 'language' is safer.
                    // But for strict locking, let's prefer 'vi' if both exist? No, 'language' is better for legacy.

                    // Check if *current* view locale has price 0, if so, switch to the other one
                    if (product.variant.price[displayLocale].original === 0) {
                        displayLocale = displayLocale === 'vi' ? 'ja' : 'vi';
                    }

                    return (
                    <div
                      key={index}
                      id={index === 0 ? "detail-product-0" : undefined}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <p className="text-sm text-gray-600">
                              {language === "vi" ? "Mã sản phẩm" : "商品コード"}
                              :
                            </p>
                            <p className="font-medium break-all">
                              {product.productCode}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              {language === "vi"
                                ? "Phân loại"
                                : "バリエーション"}
                              :
                            </p>
                            <p className="font-medium">
                              {product.variant.label[displayLocale]} ({displayLocale.toUpperCase()})
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <div className="mb-2">
                            <p className="text-sm text-gray-600">
                              {language === "vi" ? "Số lượng" : "数量"}:
                            </p>
                            <p className="font-medium">{product.quantity}</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-green-600">
                              {formatPrice(
                                calculateDiscountedPrice(
                                  product.variant.price[displayLocale].original,
                                  product.variant.price[displayLocale]
                                    .discountPercent
                                ),
                                displayLocale
                              )}
                            </p>
                            {product.variant.price[displayLocale].discountPercent >
                              0 && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(
                                  product.variant.price[displayLocale].original,
                                  displayLocale
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Cập nhật trạng thái */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  {language === "vi" ? "Cập nhật trạng thái" : "ステータス更新"}
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Edit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      id="btn-update-status-detail"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      value={selectedOrderStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        handleUpdateStatus(orderDetail.code, newStatus);
                        setSelectedOrderStatus(newStatus); // Cập nhật local state
                      }}
                      disabled={detailLoading}
                    >
                      {statusOptions.slice(1).map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label[language]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    id="btn-delete-order-detail"
                    onClick={() => handleDeleteOrder(orderDetail.code)}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={detailLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                    {language === "vi" ? "Xóa đơn hàng" : "注文削除"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 z-50" id="orders-page">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8" id="orders-header">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" id="orders-title">
              {language === "vi" ? "Quản lý đơn hàng" : "注文管理"}
            </h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <select
                id="btn-language-toggle-orders"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="ja">日本語</option>
              </select>
              <button
                id="btn-refresh-orders"
                onClick={refreshOrders}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 text-sm"
                disabled={ordersLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${ordersLoading ? "animate-spin" : ""}`}
                />
                {language === "vi" ? "Làm mới" : "リフレッシュ"}
              </button>
            </div>
          </div>

          {/* Hiển thị lỗi đơn giản hơn */}
          {ordersError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{ordersError}</p>
              </div>
            </div>
          )}

          {/* Filters - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" id="orders-filter-section">
            <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="input-search-order"
                type="text"
                placeholder={
                  language === "vi"
                    ? "Tìm kiếm theo mã đơn hàng..."
                    : "注文番号で検索..."
                }
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {searchCode && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              id="btn-search-order"
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              disabled={ordersLoading}
            >
              <Search className="w-4 h-4" />
              {language === "vi" ? "Tìm kiếm" : "検索"}
            </button>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                id="select-filter-status"
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                disabled={ordersLoading}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label[language]}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              {searchCode && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs truncate">
                  {language === "vi" ? "Tìm kiếm" : "検索"}: &quot;{searchCode}
                  &quot;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table - Responsive */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Mobile view */}
          <div className="block sm:hidden">
            {ordersLoading ? (
              <div className="p-6 text-center text-gray-500">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">
                    {language === "vi" ? "Đang tải..." : "読み込み中..."}
                  </span>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {ordersError ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      {language === "vi"
                        ? "Không thể tải danh sách đơn hàng"
                        : "注文リストを読み込めません"}
                    </p>
                    <button
                      onClick={() => fetchOrders(1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      {language === "vi" ? "Thử lại" : "再試行"}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm">
                    {language === "vi"
                      ? searchCode
                        ? `Không tìm thấy đơn hàng với mã &quot;${searchCode}&quot;`
                        : "Không có đơn hàng nào"
                      : searchCode
                      ? `&quot;${searchCode}&quot;の注文が見つかりません`
                      : "注文がありません"}
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <div 
                    key={order.code} 
                    className="p-4 space-y-3"
                    id={index === 0 ? "mobile-order-card-0" : undefined}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {order.code}
                        </p>
                        <p className="text-green-600 font-medium text-sm">
                          {formatMixedPrice(order.totalPrice)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {
                          statusOptions.find(
                            (s) => s.value === order.orderStatus
                          )?.label[language]
                        }
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        id={index === 0 ? "btn-mobile-view-0" : undefined}
                        onClick={() =>
                          handleViewDetail(order.code, order.orderStatus)
                        }
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg bg-blue-50"
                        title={
                          language === "vi" ? "Xem chi tiết" : "詳細を見る"
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={index === 0 ? "btn-mobile-edit-0" : undefined}
                        onClick={() =>
                          handleOpenStatusModal(order.code, order.orderStatus)
                        }
                        className="text-green-600 hover:text-green-900 p-2 rounded-lg bg-green-50"
                        title={
                          language === "vi"
                            ? "Cập nhật trạng thái"
                            : "ステータス更新"
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        id={index === 0 ? "btn-mobile-delete-0" : undefined}
                        onClick={() => handleDeleteOrder(order.code)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-50"
                        title={language === "vi" ? "Xóa" : "削除"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden sm:block overflow-x-auto" id="orders-table">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr id="orders-table-header">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" id="th-order-code">
                    {language === "vi" ? "Mã đơn hàng" : "注文番号"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" id="th-total">
                    {language === "vi" ? "Tổng tiền" : "合計金額"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" id="th-status">
                    {language === "vi" ? "Trạng thái" : "ステータス"}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" id="th-actions">
                    {language === "vi" ? "Thao tác" : "アクション"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordersLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">
                          {language === "vi" ? "Đang tải..." : "読み込み中..."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {ordersError ? (
                        <div className="space-y-2">
                          <p>
                            {language === "vi"
                              ? "Không thể tải danh sách đơn hàng"
                              : "注文リストを読み込めません"}
                          </p>
                          <button
                            onClick={() => fetchOrders(1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            {language === "vi" ? "Thử lại" : "再試行"}
                          </button>
                        </div>
                      ) : (
                        <p>
                          {language === "vi"
                            ? searchCode
                              ? `Không tìm thấy đơn hàng với mã &quot;${searchCode}&quot;`
                              : "Không có đơn hàng nào"
                            : searchCode
                            ? `&quot;${searchCode}&quot;の注文が見つかりません`
                            : "注文がありません"}
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.code} className="hover:bg-gray-50" id={index === 0 ? "order-row-0" : undefined}>
                      <td className="px-6 py-4 whitespace-nowrap" id={index === 0 ? "order-code-0" : undefined}>
                        <div className="font-medium text-gray-900">
                          {order.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" id={index === 0 ? "order-total-0" : undefined}>
                        <div className="text-gray-900 font-medium">
                          {formatMixedPrice(order.totalPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" id={index === 0 ? "order-status-0" : undefined}>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {
                            statusOptions.find(
                              (s) => s.value === order.orderStatus
                            )?.label[language]
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" id={index === 0 ? "order-actions-0" : undefined}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={index === 0 ? "btn-view-order-0" : undefined}
                            onClick={() =>
                              handleViewDetail(order.code, order.orderStatus)
                            }
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title={
                              language === "vi" ? "Xem chi tiết" : "詳細を見る"
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={index === 0 ? "btn-edit-status-0" : undefined}
                            onClick={() =>
                              handleOpenStatusModal(
                                order.code,
                                order.orderStatus
                              )
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title={
                              language === "vi"
                                ? "Cập nhật trạng thái"
                                : "ステータス更新"
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={index === 0 ? "btn-delete-order-0" : undefined}
                            onClick={() => handleDeleteOrder(order.code)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title={language === "vi" ? "Xóa" : "削除"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Responsive */}
          {meta && meta.totalPages > 1 && (
            <div className="px-4 sm:px-6 py-3 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700 text-center sm:text-left">
                {language === "vi" ? "Hiển thị" : "表示"}{" "}
                {(meta.page - 1) * meta.limit + 1}-
                {Math.min(meta.page * meta.limit, meta.total)}{" "}
                {language === "vi" ? "của" : "の"} {meta.total}{" "}
                {language === "vi" ? "đơn hàng" : "注文"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === 1 || ordersLoading}
                >
                  {language === "vi" ? "Trước" : "前へ"}
                </button>
                <span className="px-3 py-1 text-sm">
                  {currentPage} / {meta.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === meta.totalPages || ordersLoading}
                >
                  {language === "vi" ? "Sau" : "次へ"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && <StatusUpdateModal />}

      {/* Order Detail Modal */}
      {showOrderDetail && <OrderDetailModal />}
    </div>
  );
};

export default OrderManagement;
