import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthThrottlerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // --- Constants ---
  private readonly MAX_LOGIN_ATTEMPTS = 5; // Cho phép sai 5 lần
  private readonly LOCK_TIME_MS = 60 * 1000; // Khóa 1 phút
  private readonly CAPTCHA_TTL = 300; // 5 phút

  // Tạo key cache cho việc đếm số lần sai theo IP
  private getAttemptKey(ip: string, email: string): string {
    const safeEmail = email ? email.trim().toLowerCase() : 'unknown';
    return `login_attempts:${ip}:${safeEmail}`;
  }

  // Tạo key cache cho việc khóa theo IP
  private getLockKey(ip: string, email: string): string {
    const safeEmail = email ? email.trim().toLowerCase() : 'unknown';
    return `login_lock:${ip}:${safeEmail}`;
  }

  /**
   * Kiểm tra xem user (từ IP này) có bị khóa không
   */
  async checkLimit(ip: string, email: string): Promise<void> {
    const lockKey = this.getLockKey(ip, email);
    const lockExpiresAt = await this.cacheManager.get<number>(lockKey);

    console.log(
      `[THROTTLER] Check LockKey: ${lockKey} -> ExpiresAt: ${lockExpiresAt}, Now: ${Date.now()}`,
    );

    if (lockExpiresAt) {
      const now = Date.now();
      if (now < lockExpiresAt) {
        const remainingSeconds = Math.ceil((lockExpiresAt - now) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        throw new HttpException(
          {
            message: `Tài khoản tạm thời bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${minutes} phút ${seconds} giây.`,
            errorCode: 'AUTH_LOCKED',
            lockUntil: lockExpiresAt,
          },
          HttpStatus.FORBIDDEN, // 403 Forbidden
        );
      }
    }

    // Check attempt count
    const attemptKey = this.getAttemptKey(ip, email);
    const count = await this.cacheManager.get<number>(attemptKey);

    console.log(
      `[THROTTLER] Check AttemptKey: ${attemptKey} -> Count: ${count}/${this.MAX_LOGIN_ATTEMPTS}`,
    );

    if (count && count >= this.MAX_LOGIN_ATTEMPTS) {
      console.log(`[THROTTLER] Limit Exceeded! Locking user: ${email} at IP: ${ip}`);
      // Logic khóa tài khoản nếu vượt quá giới hạn
      await this.lockUser(ip, email);

      const updatedLockExpiresAt = await this.cacheManager.get<number>(lockKey);
      const now = Date.now();
      const lockUntil = updatedLockExpiresAt || now + this.LOCK_TIME_MS;

      const remainingSeconds = Math.ceil((lockUntil - now) / 1000);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      throw new HttpException(
        {
          message: `Tài khoản tạm thời bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${minutes} phút ${seconds} giây.`,
          errorCode: 'AUTH_LOCKED',
          lockUntil: lockUntil,
        },
        HttpStatus.FORBIDDEN, // 403 Forbidden
      );
    }
  }

  /**
   * Tăng số lần sai. Nếu vượt quá giới hạn thì khóa.
   */
  async increment(ip: string, email: string) {
    const key = this.getAttemptKey(ip, email);
    const count = (await this.cacheManager.get<number>(key)) || 0;
    const newCount = count + 1;

    console.log(`[THROTTLER] Increment Key: ${key} | ${count} -> ${newCount}`);

    // Set ttl to reset the window or extend it?
    // Usually standard rate limiting resets window on first write, or slides.
    // Here we just refresh the TTL on every write to keep the key alive while user is spamming.
    await this.cacheManager.set(key, newCount, this.LOCK_TIME_MS);
  }

  /**
   * Logic khóa user với thời gian tăng dần
   */
  private async lockUser(ip: string, email: string) {
    const key = this.getLockKey(ip, email);
    const lockUntil = Date.now() + this.LOCK_TIME_MS;
    console.log(`[THROTTLER] Setting Lock Key: ${key} until ${lockUntil}`);
    await this.cacheManager.set(key, lockUntil, this.LOCK_TIME_MS);
  }

  /**
   * Reset khi đăng nhập thành công
   */
  async reset(ip: string, email: string): Promise<void> {
    const attemptKey = this.getAttemptKey(ip, email);
    const lockKey = this.getLockKey(ip, email);
    console.log(`[THROTTLER] Resetting keys for ${email}`);
    await this.cacheManager.del(attemptKey);
    await this.cacheManager.del(lockKey);
  }
}
