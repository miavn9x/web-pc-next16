// features/admin/types/media/adminMedia.types.ts
// Các kiểu dữ liệu liên quan đến Media (ảnh, video) trong hệ thống quản trị.

/**
 * Extension
 * Enum định nghĩa các phần mở rộng (extension) hợp lệ cho media.
 */
export enum MediaExtensionEnum {
  /** Định dạng ảnh JPG */
  JPG = "jpg",
  /** Định dạng ảnh JPEG */
  JPEG = "jpeg",
  /** Định dạng ảnh PNG */
  PNG = "png",
  /** Định dạng ảnh WEBP */
  WEBP = "webp",
  /** Định dạng ảnh GIF */
  GIF = "gif",
  /** Định dạng video MP4 */
  MP4 = "mp4",
}

/**
 * MimeType
 * Enum định nghĩa các kiểu MIME type hợp lệ cho media.
 */
export enum MediaMimeTypeEnum {
  /** MIME type cho ảnh JPG */
  IMAGE_JPG = "image/jpg",
  /** MIME type cho ảnh JPEG */
  IMAGE_JPEG = "image/jpeg",
  /** MIME type cho ảnh PNG */
  IMAGE_PNG = "image/png",
  /** MIME type cho ảnh WEBP */
  IMAGE_WEBP = "image/webp",
  /** MIME type cho ảnh GIF */
  IMAGE_GIF = "image/gif",
  /** MIME type cho video MP4 */
  VIDEO_MP4 = "video/mp4",
}

/**
 * Storage
 * Enum định nghĩa các loại hình lưu trữ media.
 */
export enum MediaStorageTypeEnum {
  /** Lưu trữ tại server local */
  LOCAL = "local",
  /** Lưu trữ tại Amazon S3 */
  S3 = "s3",
  /** Lưu trữ tại CDN */
  CDN = "cdn",
}

/**
 * Usage
 * Enum định nghĩa mục đích sử dụng của media trong hệ thống.
 */
export enum MediaUsageEnum {
  /** Media sử dụng cho sản phẩm */
  PRODUCT = "product",
  /** Media sử dụng cho bài viết */
  POST = "post",
  /** Media sử dụng cho người dùng */
  /** Media sử dụng cho người dùng */
  USER = "user",
  /** Media sử dụng cho quảng cáo */
  ADVERTISEMENT = "advertisement",
  /** Media sử dụng cho mục đích khác */
  OTHER = "other",
}

/**
 * MediaType
 * Kiểu loại media: ảnh hoặc video.
 */
export type MediaType = "image" | "video";

/**
 * Interface Media
 * Định nghĩa cấu trúc dữ liệu cho một media.
 *
 * Nhóm thuộc tính:
 * - Định danh: mediaCode, originalName, slug, usage
 * - Nội dung: type, mimeType, extension, size, width, height
 * - Lưu trữ: url, storageType
 * - Trạng thái: isActive, isDeleted, deletedAt
 * - Thời gian: createdAt, updatedAt
 */
export interface Media {
  // ==== Định danh ====
  /** Mã định danh duy nhất cho media */
  mediaCode: string;
  /** Tên gốc của file media khi upload */
  originalName: string;
  /** Đường dẫn slug (dạng thân thiện) */
  slug: string;
  /** Mục đích sử dụng của media */
  usage: MediaUsageEnum;

  // ==== Nội dung ====
  /** Loại media: 'image' hoặc 'video' */
  type: MediaType;
  /** MIME type của file */
  mimeType: MediaMimeTypeEnum;
  /** Định dạng extension của file */
  extension: MediaExtensionEnum;
  /** Dung lượng file (byte) */
  size: number;
  /** Chiều rộng (px), null nếu không xác định */
  width: number | null;
  /** Chiều cao (px), null nếu không xác định */
  height: number | null;

  // ==== Lưu trữ ====
  /** Đường dẫn truy cập file media */
  url: string;
  /** Loại hình lưu trữ */
  storageType: MediaStorageTypeEnum;

  // ==== Trạng thái ====
  /** Media có đang hoạt động không */
  isActive: boolean;
  /** Media đã bị xóa mềm chưa */
  isDeleted: boolean;
  /** Thời gian xóa (ISO date string), null nếu chưa xóa */
  deletedAt: string | null;

  // ==== Thời gian ====
  /** Thời gian tạo (ISO date string) */
  createdAt: string;
  /** Thời gian cập nhật gần nhất (ISO date string) */
  updatedAt: string;
}
