// --- [Enum trạng thái đơn hàng] ---
export enum OrderStatus {
  /**
   * Đơn hàng đang chờ xử lý, chưa được xác nhận
   */
  PENDING = 'PENDING',

  /**
   * Đơn hàng đã được xác nhận bởi hệ thống hoặc nhân viên
   */
  CONFIRMED = 'CONFIRMED',

  /**
   * Đơn hàng đã được giao thành công tới khách hàng
   */
  COMPLETE = 'COMPLETE',

  /**
   * Đơn hàng đã bị hủy, không tiếp tục xử lý
   */
  CANCELLED = 'CANCELLED',
}
