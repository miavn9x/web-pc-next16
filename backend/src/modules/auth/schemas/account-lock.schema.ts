// --- Import Thư Viện NestJS ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// --- Import Mongoose ---
import { Document } from 'mongoose';

// --- Định Nghĩa Interface Cho Account Lock ---
export type AccountLockDocument = AccountLock & Document;

// --- Định Nghĩa Lock Reason Enum ---
export enum LockReason {
  CAPTCHA = 'CAPTCHA',
  PASSWORD = 'PASSWORD',
}

// --- Định Nghĩa Schema ---
@Schema({
  timestamps: true,
  collection: 'account_locks',
})
export class AccountLock {
  // --- Email của tài khoản bị lock ---
  @Prop({ required: true, index: true })
  email: string;

  // --- Địa chỉ IP của người dùng ---
  @Prop({ required: true, index: true })
  ipAddress: string;

  // --- Lý do lock: CAPTCHA hoặc PASSWORD ---
  @Prop({
    required: true,
    enum: Object.values(LockReason),
    type: String,
  })
  lockReason: LockReason;

  // --- Số lần bị lock (để tính progressive lock duration) ---
  @Prop({ required: true, default: 0 })
  lockCount: number;

  // --- Số lần nhập sai hiện tại (reset về 0 khi login thành công) ---
  @Prop({ required: true, default: 0 })
  attemptCount: number;

  // --- Thời điểm unlock (calculated based on lockCount) ---
  @Prop({ required: true })
  lockUntil: Date;

  // --- Đã unlock chưa (auto-unlock hoặc manual) ---
  @Prop({ default: false })
  isUnlocked: boolean;

  // --- Thời điểm unlock (nếu đã unlock) ---
  @Prop()
  unlockedAt?: Date;

  // --- Thời điểm cuối cùng attempt sai ---
  @Prop()
  lastAttemptAt?: Date;
}

// --- Tạo Schema Mongoose ---
export const AccountLockSchema = SchemaFactory.createForClass(AccountLock);

// --- Tạo Index để tìm kiếm nhanh ---
AccountLockSchema.index({ email: 1, ipAddress: 1, lockReason: 1 });

// --- TTL Index: Tự động xóa records sau 30 ngày ---
AccountLockSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
