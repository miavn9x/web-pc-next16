// ===============================
// IMPORTS - Thư viện và Dependencies
// ===============================

// NestJS Core - Các thư viện cốt lõi của NestJS
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Interfaces chung - Cấu trúc response chuẩn
import { StandardResponse } from 'src/common/interfaces/response.interface';

// Modules liên quan - Các module khác trong hệ thống
import { CouponService } from 'src/modules/coupons/coupon.service';
import { CouponDocument } from 'src/modules/coupons/schemas/coupon.schema';
import { MailService } from 'src/modules/mail/service/send-mail.service';

// Local Imports - Các file trong module orders
import { OrderStatus } from '../constants/order-status.enum';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { Order, OrderDocument } from '../schemas/order.schema';

// ===============================
// INTERFACES - Định nghĩa cấu trúc dữ liệu
// ===============================

/**
 * Cấu trúc metadata phân trang
 * Chứa thông tin về trang hiện tại, số items và tổng số trang
 */
export interface PaginationMeta {
  page: number; // Trang hiện tại
  limit: number; // Số items mỗi trang
  total: number; // Tổng số items
  totalPages: number; // Tổng số trang
}

// ===============================
// SERVICE - Xử lý logic nghiệp vụ đơn hàng
// ===============================

@Injectable()
export class OrderService {
  // Danh sách các trạng thái đơn hàng hợp lệ
  private static readonly VALID_ORDER_STATUSES = Object.values(OrderStatus);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly mailService: MailService,
    private readonly couponService: CouponService,
  ) {}

  // ===============================
  // TẠO ĐƠN HÀNG MỚI
  // ===============================

  /**
   * Tạo đơn hàng mới với đầy đủ tính năng
   *
   * @param dto - Thông tin đơn hàng từ client (sản phẩm, thông tin khách hàng, mã giảm giá)
   * @returns Response chứa đơn hàng đã tạo hoặc lỗi nếu có
   *
   * Quy trình xử lý:
   * 1. Tính tổng giá đơn hàng cho cả tiếng Việt và tiếng Nhật
   * 2. Áp dụng mã giảm giá (coupon) nếu có - validate và tính toán discount
   * 3. Sinh mã đơn hàng duy nhất (format: OD + ddMMyy + 6 số ngẫu nhiên)
   * 4. Lưu đơn hàng vào database
   * 5. Gửi email xác nhận đơn hàng cho khách
   */
  async createOrder(dto: CreateOrderDto): Promise<StandardResponse<OrderDocument>> {
    // BƯỚC 1: Tính tổng giá đơn hàng theo từng ngôn ngữ (VI và JA)
    const totalPrice = { vi: 0, ja: 0 };

    // Duyệt qua từng sản phẩm trong đơn hàng
    for (const item of dto.products) {
      const priceVi = item.variant.price.vi;
      const priceJa = item.variant.price.ja;

      // Áp dụng % giảm giá của từng sản phẩm
      const finalPriceVi = priceVi.original - (priceVi.original * priceVi.discountPercent) / 100;
      const finalPriceJa = priceJa.original - (priceJa.original * priceJa.discountPercent) / 100;

      // Cộng dồn theo số lượng
      totalPrice.vi += finalPriceVi * item.quantity;
      totalPrice.ja += finalPriceJa * item.quantity;
    }

    // BƯỚC 2: Xử lý mã giảm giá (Coupon) nếu có
    const discountValue = { vi: 0, ja: 0 }; // Giá trị giảm
    const finalTotalPrice = { ...totalPrice }; // Tổng tiền cuối cùng

    if (dto.couponCode) {
      try {
        // Tìm coupon theo code
        const coupon = await this.couponService.findByCode(dto.couponCode);

        // Kiểm tra tính hợp lệ của coupon
        if (!coupon.isActive) throw new Error('Mã giảm giá đã tạm dừng');
        if (coupon.limit <= coupon.used) throw new Error('Mã giảm giá đã hết lượt sử dụng');
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date())
          throw new Error('Mã giảm giá đã hết hạn');

        // Tính giá trị giảm giá cho cả 2 ngôn ngữ
        if (coupon.type === 'percent') {
          // Nếu giảm theo %, tính % của tổng tiền
          discountValue.vi = (totalPrice.vi * coupon.value.vi) / 100;
          discountValue.ja = (totalPrice.ja * coupon.value.ja) / 100;
        } else {
          // Nếu giảm cố định, lấy giá trị trực tiếp
          discountValue.vi = coupon.value.vi;
          discountValue.ja = coupon.value.ja;
        }

        // Tính tổng tiền sau giảm (không được âm)
        finalTotalPrice.vi = Math.max(0, totalPrice.vi - discountValue.vi);
        finalTotalPrice.ja = Math.max(0, totalPrice.ja - discountValue.ja);

        // Tăng số lần đã sử dụng coupon
        await this.couponService.update(String((coupon as unknown as CouponDocument)._id), {
          used: coupon.used + 1,
        });
      } catch (error: any) {
        throw new Error(
          `Lỗi mã giảm giá: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // BƯỚC 3: Sinh mã đơn hàng duy nhất
    // Format: OD + ngàytháng năm (ddMMyy) + 6 chữ số ngẫu nhiên
    // Ví dụ: OD09120112345678
    let orderCode = '';
    let isDuplicate = true;
    const now = new Date();
    const ddMMyy = now
      .toLocaleDateString('vi-VN')
      .split('/')
      .map(part => part.padStart(2, '0'))
      .slice(0, 2)
      .concat(now.getFullYear().toString().slice(-2))
      .join('');

    // Thử sinh mã đơn hàng unique, tối đa 5 lần
    let attempts = 0;
    while (isDuplicate && attempts < 5) {
      // Sinh 6 chữ số ngẫu nhiên từ 100000 đến 999999
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      orderCode = `OD${ddMMyy}${randomDigits}`;

      // Kiểm tra xem mã đã tồn tại chưa
      const existingOrder = await this.orderModel.findOne({ code: orderCode });
      isDuplicate = !!existingOrder;
      attempts++;
    }

    // Nếu sau 5 lần vẫn trùng, báo lỗi
    if (isDuplicate) {
      return {
        data: null,
        message: 'Không thể tạo mã đơn hàng. Vui lòng thử lại.',
        errorCode: 'ORDER_CODE_GENERATION_FAILED',
      };
    }

    // BƯỚC 4: Tạo và lưu đơn hàng vào database
    const createdOrder = new this.orderModel({
      ...dto,
      code: orderCode,
      totalPrice, // Tổng giá gốc
      discountValue, // Giá trị giảm từ coupon
      finalTotalPrice, // Tổng giá sau khi giảm
    });

    const saved = await createdOrder.save();

    // BƯỚC 5: Gửi email xác nhận đơn hàng
    await this.mailService.sendOrderNotification({
      code: saved.code,
      email: saved.email,
      phone: saved.phone,
      shippingAddress: saved.address,
      totalPrice: saved.totalPrice.vi,
    });

    // Trả về kết quả thành công
    return {
      data: saved,
      message: 'Tạo đơn hàng thành công',
      errorCode: null,
    };
  }

  // ===============================
  // LẤY DANH SÁCH ĐƠN HÀNG (PHÂN TRANG)
  // ===============================

  /**
   * Lấy danh sách đơn hàng có phân trang
   *
   * @param page - Số trang hiện tại (bắt đầu từ 1)
   * @param limit - Số lượng đơn hàng mỗi trang
   * @returns Response chứa danh sách đơn hàng và metadata phân trang
   */
  async getOrderList(
    page: number,
    limit: number,
  ): Promise<StandardResponse<{ items: OrderDocument[]; meta: PaginationMeta }>> {
    const skip = (page - 1) * limit;

    const orders = await this.orderModel
      .find({}, 'code totalPrice orderStatus createdAt -_id')
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.orderModel.countDocuments();
    if (orders.length === 0) {
      return {
        message: 'Không có đơn hàng nào',
        data: {
          items: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
        errorCode: 'NO_ORDERS_FOUND',
      };
    }
    return {
      message: 'Lấy danh sách đơn hàng thành công',
      data: {
        items: orders,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      errorCode: null,
    };
  }

  // ===============================
  // LỌC ĐƠN HÀNG THEO TRẠNG THÁI
  // ===============================

  /**
   * Lọc đơn hàng theo trạng thái với phân trang
   *
   * @param orderStatus - Trạng thái cần lọc (PENDING, CONFIRMED, COMPLETE, CANCELLED)
   * @param page - Số trang hiện tại
   * @param limit - Số lượng mỗi trang
   * @returns Danh sách đơn hàng theo trạng thái
   */
  async filterOrders(
    orderStatus: string,
    page: number,
    limit: number,
  ): Promise<StandardResponse<{ items: OrderDocument[]; meta: PaginationMeta }>> {
    const skip = (page - 1) * limit;

    // Kiểm tra trạng thái không được rỗng
    if (!orderStatus) {
      return {
        message: 'Trạng thái đơn hàng không được để trống',
        data: null,
        errorCode: 'INVALID_ORDER_STATUS',
      };
    }
    const orders = await this.orderModel
      .find({ orderStatus }, 'code totalPrice orderStatus createdAt -_id')
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.orderModel.countDocuments({ orderStatus });
    if (orders.length === 0) {
      return {
        message: 'Không tìm thấy đơn hàng với trạng thái đã lọc',
        data: {
          items: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
        errorCode: 'NO_ORDERS_FOUND',
      };
    }

    return {
      message: 'Lọc đơn hàng thành công',
      data: {
        items: orders,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      errorCode: null,
    };
  }

  // ===============================
  // TÌM KIẾM ĐƠN HÀNG THEO MÃ
  // ===============================

  /**
   * Tìm kiếm đơn hàng theo mã code
   * Hỗ trợ tìm theo mã đầy đủ hoặc chỉ 1-6 chữ số cuối
   *
   * @param codeFragment - Mã đơn hàng đầy đủ (VD: OD091201123456) hoặc 1-6 số cuối (VD: 123456)
   * @param page - Số trang
   * @param limit - Số items/trang
   * @returns Danh sách đơn hàng khớp với mã
   */
  async searchOrderByCode(
    codeFragment: string,
    page: number,
    limit: number,
  ): Promise<StandardResponse<{ items: OrderDocument[]; meta: PaginationMeta }>> {
    const skip = (page - 1) * limit;

    // Cho phép tìm kiếm theo mã đầy đủ OD[ddMMyy][6 số] hoặc 1-6 chữ số cuối
    if (!codeFragment || !/^(\d{1,6}|OD\d{6}\d{6})$/i.test(codeFragment)) {
      return {
        message: 'Mã đơn hàng không hợp lệ hoặc không đúng định dạng',
        data: null,
        errorCode: 'INVALID_ORDER_CODE',
      };
    }

    // Tạo regex pattern tùy theo loại tìm kiếm
    const regex = codeFragment.startsWith('OD')
      ? new RegExp(`^${codeFragment}$`, 'i')
      : new RegExp(`OD\\d{6}${codeFragment}$`, 'i');

    const orders = await this.orderModel
      .find({ code: { $regex: regex } }, 'code totalPrice orderStatus createdAt -_id')
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.orderModel.countDocuments({
      code: { $regex: regex },
    });
    if (total === 0) {
      return {
        message: 'Không tìm thấy đơn hàng với mã đơn hàng',
        data: {
          items: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
        errorCode: 'NO_ORDERS_FOUND',
      };
    }
    return {
      message: 'Tìm kiếm đơn hàng theo mã thành công',
      data: {
        items: orders,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      errorCode: null,
    };
  }

  // ===============================
  // LẤY CHI TIẾT ĐƠN HÀNG
  // ===============================

  /**
   * Lấy thông tin chi tiết của một đơn hàng
   *
   * @param code - Mã đơn hàng cần lấy
   * @returns Đơn hàng đầy đủ thông tin
   */
  async getOrderDetail(code: string): Promise<StandardResponse<OrderDocument>> {
    const order = await this.orderModel.findOne({ code }).exec();

    if (!order) {
      return {
        message: 'Không tìm thấy đơn hàng',
        data: null,
        errorCode: 'ORDER_NOT_FOUND',
      };
    }

    return {
      message: 'Lấy chi tiết đơn hàng thành công',
      data: order,
      errorCode: null,
    };
  }

  // ===============================
  // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
  // ===============================

  /**
   * Cập nhật trạng thái đơn hàng
   *
   * @param code - Mã đơn hàng
   * @param orderStatus - Trạng thái mới (PENDING/CONFIRMED/COMPLETE/CANCELLED)
   * @returns Đơn hàng đã cập nhật
   */
  async updateOrderStatus(
    code: string,
    orderStatus: string,
  ): Promise<StandardResponse<OrderDocument>> {
    // Kiểm tra trạng thái hợp lệ
    if (!OrderService.VALID_ORDER_STATUSES.includes(orderStatus as OrderStatus)) {
      return {
        message: 'Trạng thái đơn hàng không hợp lệ',
        data: null,
        errorCode: 'INVALID_ORDER_STATUS',
      };
    }

    const updatedOrder = await this.orderModel.findOneAndUpdate(
      { code },
      { orderStatus },
      { new: true },
    );

    if (!updatedOrder) {
      return {
        message: 'Không tìm thấy đơn hàng cần cập nhật',
        data: null,
        errorCode: 'ORDER_NOT_FOUND',
      };
    }

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updatedOrder,
      errorCode: null,
    };
  }

  // ===============================
  // XÓA ĐƠN HÀNG
  // ===============================

  /**
   * Xóa đơn hàng khỏi hệ thống
   *
   * @param code - Mã đơn hàng cần xóa
   * @returns Response xác nhận đã xóa
   */
  async deleteOrder(code: string): Promise<StandardResponse<null>> {
    const result = await this.orderModel.deleteOne({ code }).exec();

    if (result.deletedCount === 0) {
      return {
        message: 'Không tìm thấy đơn hàng cần xoá',
        data: null,
        errorCode: 'ORDER_NOT_FOUND',
      };
    }

    return {
      message: 'Xoá đơn hàng thành công',
      data: null,
      errorCode: null,
    };
  }

  // ===============================
  // HELPER: CHUẨN HÓA CHUỖI
  // ===============================

  /**
   * Chuẩn hóa chuỗi để so sánh (bỏ dấu, chữ thường)
   * Dùng cho việc deduplicate khách hàng
   *
   * @param str - Chuỗi cần chuẩn hóa
   * @returns Chuỗi đã chuẩn hóa (không dấu, lowercase)
   */
  private normalizeString(str?: string): string {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD') // Tách ký tự có dấu thành ký tự gốc + dấu riêng
      .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
      .replace(/đ/g, 'd') // Xử lý ký tự đặc biệt tiếng Việt
      .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
      .trim();
  }

  // ===============================
  // THỐNG KÊ KHÁCH HÀNG (DEDUPLICATION)
  // ===============================

  /**
   * Lấy thống kê khách hàng với tính năng gộp khách trùng (deduplication)
   *
   * Thuật toán Union-Find để gộp các đơn hàng của cùng 1 khách hàng:
   * - Nếu 2 đơn hàng có cùng email/phone/address → coi là 1 khách
   * - Tính tổng số tiền, số đơn hàng của từng khách
   * - Chọn thông tin đầy đủ nhất (tên dài nhất, contact info mới nhất)
   *
   * @param page - Số trang
   * @param limit - Số items/trang
   * @param search - Từ khóa tìm kiếm (tên, email, phone)
   * @returns Danh sách khách hàng đã gộp với thống kê
   */
  async getCustomersStats(
    page: number,
    limit: number,
    search?: string,
  ): Promise<StandardResponse<{ items: any[]; meta: PaginationMeta }>> {
    // BƯỚC 1: Lấy tất cả đơn hàng với các trường cần thiết
    const orders = await this.orderModel
      .find()
      .select('code fullName email phone address totalPrice createdAt')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // BƯỚC 2: Khởi tạo cấu trúc Union-Find để gộp khách hàng trùng
    const parent = new Array(orders.length).fill(0).map((_, i) => i);

    // Hàm tìm root (gốc) của một phần tử với path compression
    const find = (i: number): number => {
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]); // Path compression để tối ưu
      return parent[i];
    };

    // Hàm gộp 2 nhóm lại với nhau
    const union = (i: number, j: number) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) parent[rootI] = rootJ;
    };

    // BƯỚC 3: Nhóm các đơn hàng theo đặc điểm khách hàng (email, phone, address)
    const emailMap = new Map<string, number>();
    const phoneMap = new Map<string, number>();
    const addressMap = new Map<string, number>();

    orders.forEach((order, index) => {
      // Chuẩn hóa dữ liệu đầu vào
      const normEmail = this.normalizeString(order.email);
      const normPhone = order.phone?.replace(/\D/g, ''); // Bỏ tất cả ký tự không phải số
      const normAddress = this.normalizeString(order.address);

      // Gộp theo email (chỉ chấp nhận email dài hơn 5 ký tự)
      if (normEmail && normEmail.length > 5) {
        if (emailMap.has(normEmail)) {
          union(index, emailMap.get(normEmail)!);
        } else {
          emailMap.set(normEmail, index);
        }
      }

      // Gộp theo số điện thoại (tối thiểu 7 số)
      if (normPhone && normPhone.length > 6) {
        if (phoneMap.has(normPhone)) {
          union(index, phoneMap.get(normPhone)!);
        } else {
          phoneMap.set(normPhone, index);
        }
      }

      // Gộp theo địa chỉ (tối thiểu 10 ký tự để tránh "VN", "HCM" v.v...)
      if (normAddress && normAddress.length > 10) {
        if (addressMap.has(normAddress)) {
          union(index, addressMap.get(normAddress)!);
        } else {
          addressMap.set(normAddress, index);
        }
      }
    });

    // BƯỚC 4: Tổng hợp dữ liệu khách hàng theo nhóm root
    interface CustomerGroupStats {
      id: number;
      fullName: string;
      email: string;
      phone: string;
      address: string;
      ordersCount: number;
      totalSpent: { vi: number; ja: number };
      lastOrderDate: Date;
      orderCodes: string[];
    }

    const groups = new Map<number, CustomerGroupStats>();

    orders.forEach((order, index) => {
      const root = find(index);
      if (!groups.has(root)) {
        groups.set(root, {
          id: root,
          fullName: '',
          email: '',
          phone: '',
          address: '',
          ordersCount: 0,
          totalSpent: { vi: 0, ja: 0 },
          lastOrderDate: new Date(0),
          orderCodes: [],
        });
      }

      const group = groups.get(root)!;
      group.ordersCount += 1;
      group.totalSpent.vi += order.totalPrice?.vi || 0;
      group.totalSpent.ja += order.totalPrice?.ja || 0;
      group.orderCodes.push(order.code);

      const orderDate = new Date(order.createdAt as unknown as string);

      // Cập nhật ngày đơn hàng gần nhất
      if (orderDate > group.lastOrderDate) {
        group.lastOrderDate = orderDate;
      }

      // Chọn tên và địa chỉ dài nhất (thường đầy đủ hơn)
      const currentName = order.fullName?.trim() || '';
      const currentAddress = order.address?.trim() || '';

      if (currentName.length > group.fullName.length) {
        group.fullName = currentName;
      }
      if (currentAddress.length > group.address.length) {
        group.address = currentAddress;
      }

      // Sử dụng thông tin liên hệ mới nhất từ đơn hàng gần đây
      if (orderDate >= group.lastOrderDate) {
        if (order.email) group.email = order.email;
        if (order.phone) group.phone = order.phone;
      } else {
        // Nếu chưa có thì lấy từ đơn hàng cũ
        if (!group.email && order.email) group.email = order.email;
        if (!group.phone && order.phone) group.phone = order.phone;
      }
    });

    // BƯỚC 5: Chuyển đổi groups thành array và áp dụng bộ lọc tìm kiếm
    let customers = Array.from(groups.values()).map(g => ({
      id: g.id,
      fullName: g.fullName || 'Khách hàng vãng lai',
      email: g.email || '',
      phone: g.phone || '',
      address: g.address || '',
      totalOrders: g.ordersCount,
      totalSpent: g.totalSpent,
      lastOrderDate: g.lastOrderDate,
    }));

    // Áp dụng tìm kiếm nếu có
    if (search) {
      const s = this.normalizeString(search);
      customers = customers.filter(
        c =>
          this.normalizeString(c.fullName).includes(s) ||
          this.normalizeString(c.email).includes(s) ||
          c.phone?.includes(s),
      );
    }

    // BƯỚC 6: Phân trang kết quả
    const total = customers.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = customers.slice(startIndex, startIndex + limit);

    return {
      message: 'Lấy thống kê khách hàng thành công',
      data: {
        items: paginatedItems,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      errorCode: null,
    };
  }
}
