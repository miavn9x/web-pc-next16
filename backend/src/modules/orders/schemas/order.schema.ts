// --- [Thư viện] ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from '../constants/order-status.enum';

export type OrderDocument = Order & Document;

/**
 * Định nghĩa schema đơn hàng bao gồm thông tin sản phẩm,
 * biến thể, tổng tiền và trạng thái xử lý
 */

// --- [MultilangString] ---
class MultilangString {
  // Giá trị tiếng Việt
  @Prop({ required: true, default: '' })
  vi: string;

  // Giá trị tiếng Nhật
  @Prop({ required: true, default: '' })
  ja: string;
}

// --- [PriceDetail SubSchema] ---
@Schema({ _id: false })
class PriceDetail {
  // Giá gốc của biến thể
  @Prop({ required: true, min: 0, default: 0 })
  original: number;

  // Phần trăm giảm giá (0–100)
  @Prop({ required: true, min: 0, max: 100, default: 0 })
  discountPercent: number;
}

// --- [PriceMultilang] ---
@Schema({ _id: false })
class PriceMultilang {
  // Giá và giảm giá tiếng Việt
  @Prop({ type: PriceDetail, required: true })
  vi: PriceDetail;

  // Giá và giảm giá tiếng Nhật
  @Prop({ type: PriceDetail, required: true })
  ja: PriceDetail;
}

// --- [Variant] ---
@Schema({ _id: false })
class Variant {
  // Tên hiển thị biến thể (đa ngôn ngữ)
  @Prop({ type: MultilangString, required: true })
  label: MultilangString;

  // Giá bán theo từng ngôn ngữ
  @Prop({ type: PriceMultilang, required: true })
  price: PriceMultilang;
}

// --- [OrderProduct SubSchema] ---
@Schema({ _id: false })
class OrderProduct {
  /**
   * Mã sản phẩm tại thời điểm đặt hàng
   * Dùng để đối chiếu với dữ liệu gốc nếu cần
   */
  @Prop({ type: String, required: true })
  productCode: string;

  /**
   * Thông tin biến thể tại thời điểm đặt hàng
   * Bao gồm tên hiển thị và giá đã chọn
   */
  @Prop({ type: Variant, required: true })
  variant: Variant;

  /**
   * Số lượng sản phẩm đã đặt
   * Giá trị tối thiểu là 1
   */
  @Prop({ required: true, min: 1 })
  quantity: number;
}

// --- [Schema chính: Product] ---
@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  // --- Cấu trúc trường dữ liệu ---

  /**
   * Mã đơn hàng duy nhất, dùng để truy xuất và quản lý đơn hàng dễ dàng
   * Trường bắt buộc và phải là duy nhất trong collection
   */
  @Prop({ required: true, unique: true })
  code: string;

  /**
   * Tên đầy đủ của người nhận hàng
   * Trường bắt buộc, mặc định là chuỗi rỗng nếu không có dữ liệu
   */
  @Prop({ required: true, default: '' })
  fullName: string;

  /**
   * Email của người nhận hàng
   * Trường bắt buộc, mặc định là chuỗi rỗng nếu không có dữ liệu
   */
  @Prop({ required: true, default: '' })
  email: string;

  /**
   * Số điện thoại của người nhận hàng
   * Trường bắt buộc, mặc định là chuỗi rỗng nếu không có dữ liệu
   */
  @Prop({ required: true, default: '' })
  phone: string;

  /**
   * Địa chỉ giao hàng
   * Trường bắt buộc, mặc định là chuỗi rỗng nếu không có dữ liệu
   */
  @Prop({ required: true, default: '' })
  address: string;

  /**
   * Ghi chú thêm cho đơn hàng
   * Trường không bắt buộc, mặc định là chuỗi rỗng nếu không có dữ liệu
   */
  @Prop({ default: '' })
  note: string;

  /**
   * Danh sách các sản phẩm trong đơn hàng
   * Mỗi sản phẩm bao gồm:
   * - productCode: mã định danh sản phẩm trong hệ thống (bắt buộc)
   * - variant: thông tin biến thể sản phẩm bao gồm label và finalPrice
   * - quantity: số lượng sản phẩm khách hàng đặt mua (bắt buộc, >= 1)
   * Trường này là mảng và bắt buộc có ít nhất một sản phẩm
   */
  @Prop({ type: [OrderProduct], required: true })
  products: OrderProduct[];

  /**
   * Tổng số tiền của toàn bộ đơn hàng
   * Là tổng giá cuối cùng của tất cả các sản phẩm trong đơn
   * Trường bắt buộc và giá trị phải lớn hơn hoặc bằng 0
   */
  @Prop({
    required: true,
    type: {
      vi: { type: Number, required: true, min: 0 },
      ja: { type: Number, required: true, min: 0 },
    },
    _id: false,
  })
  totalPrice: {
    vi: number;
    ja: number;
  };

  // --- [Thông tin giảm giá] ---
  @Prop({ default: null })
  couponCode?: string;

  @Prop({
    type: {
      vi: { type: Number, default: 0 },
      ja: { type: Number, default: 0 },
    },
    _id: false,
    default: { vi: 0, ja: 0 },
  })
  discountValue: {
    vi: number;
    ja: number;
  };

  @Prop({
    type: {
      vi: { type: Number, default: 0 },
      ja: { type: Number, default: 0 },
    },
    _id: false,
    default: { vi: 0, ja: 0 },
  })
  finalTotalPrice: {
    vi: number;
    ja: number;
  };

  /**
   * Trạng thái hiện tại của đơn hàng
   * Thể hiện bước xử lý đơn hàng trong quy trình bán hàng
   * Giá trị thuộc enum OrderStatus gồm: PENDING (chờ xử lý), CONFIRMED (đã xác nhận), COMPLETE (hoàn tất), CANCELLED (đã huỷ)
   * Trường bắt buộc, mặc định là PENDING
   */
  @Prop({ required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  /**
   * Thời gian tạo đơn hàng
   * Được tạo tự động bởi Mongoose khi lưu dữ liệu
   * Trường có chỉ mục để tối ưu truy vấn
   */
  @Prop({ index: true })
  createdAt: Date;

  /**
   * Thời gian cập nhật cuối cùng của đơn hàng
   * Được cập nhật tự động bởi Mongoose khi có thay đổi dữ liệu
   * Trường có chỉ mục để tối ưu truy vấn
   */
  @Prop({ index: true })
  updatedAt: Date;
}

// --- [Tạo Schema và chỉ mục] ---
// Tạo OrderSchema từ class Order để dùng với Mongoose
export const OrderSchema = SchemaFactory.createForClass(Order);

// --- [Chỉ mục Schema] ---

OrderSchema.index({ createdAt: -1, updatedAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1, updatedAt: -1 });
