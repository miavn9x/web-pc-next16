import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { AccountLock, AccountLockDocument, LockReason } from '../schemas/account-lock.schema';

// --- Interface Cache Manager ---
interface CacheManager {
  get<T>(key: string): Promise<T | undefined | null>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

@Injectable()
export class AuthThrottlerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    @InjectModel(AccountLock.name)
    private readonly accountLockModel: Model<AccountLockDocument>,
  ) {}

  // --- Constants ---
  private readonly MAX_ATTEMPTS = 5; // Cho phép sai 5 lần trước khi lock
  private readonly CAPTCHA_TTL = 300; // 5 phút

  /**
   * Tính toán thời gian lock dựa trên số lần bị lock
   * Progressive: 1min → 5min → 15min → 30min → 1h → 3h → 6h → 12h → 24h → 48h → 7 ngày → 30 ngày
   */
  private calculateLockDuration(lockCount: number): number {
    const durations = [
      1 * 60 * 1000, // Lần 1: 1 phút
      5 * 60 * 1000, // Lần 2: 5 phút
      15 * 60 * 1000, // Lần 3: 15 phút
      30 * 60 * 1000, // Lần 4: 30 phút
      60 * 60 * 1000, // Lần 5: 1 giờ
      3 * 60 * 60 * 1000, // Lần 6: 3 giờ
      6 * 60 * 60 * 1000, // Lần 7: 6 giờ
      12 * 60 * 60 * 1000, // Lần 8: 12 giờ
      24 * 60 * 60 * 1000, // Lần 9: 24 giờ (1 ngày)
      48 * 60 * 60 * 1000, // Lần 10: 48 giờ (2 ngày)
      7 * 24 * 60 * 60 * 1000, // Lần 11: 7 ngày (1 tuần)
      30 * 24 * 60 * 60 * 1000, // Lần 12+: 30 ngày (1 tháng) - Maximum
    ];
    const index = Math.min(lockCount, durations.length - 1);
    return durations[index];
  }

  /**
   * Tạo key cache cho attempt count
   */
  private getAttemptKey(ip: string, email: string, reason: LockReason): string {
    const safeEmail = email ? email.trim().toLowerCase() : 'unknown';
    return `attempt:${reason}:${ip}:${safeEmail}`;
  }

  /**
   * Kiểm tra xem user có đang bị lock không (từ database)
   * @returns Lock info nếu đang bị lock, null nếu không
   */
  async checkLock(
    email: string,
    ip: string,
    reason: LockReason,
  ): Promise<{
    locked: boolean;
    message?: string;
    errorCode?: string;
    lockUntil?: number;
    lockReason?: LockReason;
    lockCount?: number;
  }> {
    const safeEmail = email.trim().toLowerCase();

    // Tìm active lock từ database
    const activeLock = await this.accountLockModel.findOne({
      email: safeEmail,
      ipAddress: ip,
      lockReason: reason,
      isUnlocked: false,
      lockUntil: { $gt: new Date() },
    });

    if (activeLock) {
      const now = Date.now();
      const lockUntilTimestamp = activeLock.lockUntil.getTime();

      if (now < lockUntilTimestamp) {
        const remainingSeconds = Math.ceil((lockUntilTimestamp - now) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        const reasonText = reason === LockReason.CAPTCHA ? 'mã xác nhận' : 'mật khẩu';

        return {
          locked: true,
          message: `Tài khoản tạm thời bị khóa do nhập sai ${reasonText} quá nhiều lần. Vui lòng thử lại sau ${minutes} phút ${seconds} giây.`,
          errorCode: 'AUTH_LOCKED',
          lockUntil: lockUntilTimestamp,
          lockReason: reason,
          lockCount: activeLock.lockCount,
        };
      } else {
        // Lock đã hết hạn, tự động unlock
        activeLock.isUnlocked = true;
        activeLock.unlockedAt = new Date();
        await activeLock.save();
      }
    }

    return { locked: false };
  }

  /**
   * Tăng attempt count cho Captcha hoặc Password
   * Nếu vượt quá MAX_ATTEMPTS → Lock account
   */
  async incrementAttempt(email: string, ip: string, reason: LockReason): Promise<void> {
    const safeEmail = email.trim().toLowerCase();
    const key = this.getAttemptKey(ip, safeEmail, reason);

    // Lấy attempt count từ cache
    const count = (await this.cacheManager.get<number>(key)) || 0;
    const newCount = count + 1;

    console.log(
      `[THROTTLER] Increment ${reason} - Email: ${safeEmail}, IP: ${ip}, Count: ${count} → ${newCount}`,
    );

    // Lưu vào cache với TTL 60 giây
    await this.cacheManager.set(key, newCount, 60 * 1000);

    // Nếu vượt quá giới hạn → Lock account
    if (newCount >= this.MAX_ATTEMPTS) {
      console.log(`[THROTTLER] Max attempts reached! Locking account...`);
      await this.lockAccount(safeEmail, ip, reason);
      // Xóa cache sau khi lock
      await this.cacheManager.del(key);
    }
  }

  /**
   * Lock account và lưu vào database
   */
  private async lockAccount(email: string, ip: string, reason: LockReason): Promise<void> {
    // Tìm lock record hiện tại (nếu có)
    const existingLock = await this.accountLockModel.findOne({
      email,
      ipAddress: ip,
      lockReason: reason,
    });

    let lockCount = 0;
    if (existingLock) {
      lockCount = existingLock.lockCount + 1;
    }

    const lockDuration = this.calculateLockDuration(lockCount);
    const lockUntil = new Date(Date.now() + lockDuration);

    if (existingLock) {
      // Update existing lock
      existingLock.lockCount = lockCount;
      existingLock.attemptCount = this.MAX_ATTEMPTS;
      existingLock.lockUntil = lockUntil;
      existingLock.isUnlocked = false;
      existingLock.lastAttemptAt = new Date();
      await existingLock.save();

      console.log(
        `[THROTTLER] Updated lock - Email: ${email}, Reason: ${reason}, LockCount: ${lockCount}, Until: ${lockUntil.toISOString()}`,
      );
    } else {
      // Create new lock record
      await this.accountLockModel.create({
        email,
        ipAddress: ip,
        lockReason: reason,
        lockCount,
        attemptCount: this.MAX_ATTEMPTS,
        lockUntil,
        isUnlocked: false,
        lastAttemptAt: new Date(),
      });

      console.log(
        `[THROTTLER] Created new lock - Email: ${email}, Reason: ${reason}, LockCount: ${lockCount}, Until: ${lockUntil.toISOString()}`,
      );
    }
  }

  /**
   * Reset lock khi đăng nhập thành công
   * Xóa tất cả cache và đánh dấu database locks là unlocked
   */
  async resetLock(email: string, ip: string): Promise<void> {
    const safeEmail = email.trim().toLowerCase();

    console.log(`[THROTTLER] Resetting locks for Email: ${safeEmail}, IP: ${ip}`);

    // Xóa cache cho cả captcha và password
    await this.cacheManager.del(this.getAttemptKey(ip, safeEmail, LockReason.CAPTCHA));
    await this.cacheManager.del(this.getAttemptKey(ip, safeEmail, LockReason.PASSWORD));

    // Unlock tất cả active locks trong database
    await this.accountLockModel.updateMany(
      {
        email: safeEmail,
        ipAddress: ip,
        isUnlocked: false,
      },
      {
        $set: {
          isUnlocked: true,
          unlockedAt: new Date(),
          attemptCount: 0, // Reset attempt count
        },
      },
    );

    console.log(`[THROTTLER] Reset completed for ${safeEmail}`);
  }

  /**
   * Lấy thông tin lock hiện tại (dùng cho debugging/admin panel)
   */
  async getLockInfo(email: string, ip: string): Promise<AccountLockDocument[]> {
    return this.accountLockModel.find({
      email: email.trim().toLowerCase(),
      ipAddress: ip,
      isUnlocked: false,
      lockUntil: { $gt: new Date() },
    });
  }
}
