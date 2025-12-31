import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { AuthErrorCode } from '../constants/auth-error-code.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto';
import * as svgCaptcha from 'svg-captcha';

// --- Nhập Các Dịch Vụ Nội Bộ ---
import { JwtService } from '../../../common/jwt/services/jwt.service';
import { setAuthCookies } from '../utils/set-cookie.util';
import { AuthThrottlerService } from './auth-throttler.service';
import { LockReason } from '../schemas/account-lock.schema';

// --- Nhập Repository ---
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository';

// --- Nhập DTOs ---
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

// --- Nhập Mongoose và Schema ---
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from '../../../common/jwt/types/jwt.type';
import { User, UserDocument } from '../../users/schemas/user.schema';

// --- Định Nghĩa Interface Cache Manager (Fix lỗi ESLint) ---
interface CacheManager {
  get<T>(key: string): Promise<T | undefined | null>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

// --- Định Nghĩa Auth Service ---
// Xử lý nghiệp vụ xác thực, phân quyền và quản lý phiên đăng nhập
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository, // Xử lý nghiệp vụ xác thực và phiên
    private readonly jwtService: JwtService, // Tạo và xác thực token
    private readonly authThrottler: AuthThrottlerService, // Xử lý rate limit
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>, // Truy cập bảng người dùng
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager, // Sử dụng Interface đã định nghĩa
  ) {}

  // --- Tạo Captcha ---
  async generateCaptcha() {
    const { data, text } = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      background: '#f0f0f0',
      width: 120,
      height: 40,
    });

    const captchaId = crypto.randomUUID();
    // Lưu text vào cache, hết hạn sau 5 phút
    await this.cacheManager.set(`captcha:${captchaId}`, text.toLowerCase(), 5 * 60 * 1000);

    return {
      captchaId,
      captchaImage: data,
    };
  }

  // --- Validate Captcha ---
  private async validateCaptcha(captchaId: string, captchaCode: string) {
    if (!captchaId || !captchaCode) return false;
    const cachedCode = await this.cacheManager.get(`captcha:${captchaId}`);
    if (!cachedCode) {
      return false; // Hết hạn hoặc không tồn tại
    }
    // Xóa ngay sau khi dùng để tránh replay attack
    await this.cacheManager.del(`captcha:${captchaId}`);
    return cachedCode === captchaCode.toLowerCase();
  }

  // --- Đăng Ký Người Dùng ---
  /**
   * Xử lý đăng ký tài khoản mới cho người dùng
   */
  async register(dto: RegisterDto, ip: string, userAgent?: string) {
    const { email, password, captchaId, captchaCode } = dto;

    // 0. Kiểm tra Captcha Lock từ Database
    console.log(`[DEBUG] Register Check - IP: ${ip}, Email: ${email}`);
    const captchaLockCheck = await this.authThrottler.checkLock(email, ip, LockReason.CAPTCHA);
    if (captchaLockCheck.locked) {
      return {
        message: captchaLockCheck.message || 'Tài khoản bị khóa do sai mã xác nhận.',
        data: { lockUntil: captchaLockCheck.lockUntil, lockReason: captchaLockCheck.lockReason },
        errorCode: captchaLockCheck.errorCode || 'AUTH_LOCKED',
      };
    }

    // 0.1 Validate Captcha Server-Side
    const isCaptchaValid = await this.validateCaptcha(captchaId, captchaCode);
    console.log(`[DEBUG] Captcha Valid: ${isCaptchaValid}, Code: ${captchaCode}, ID: ${captchaId}`);

    if (!isCaptchaValid) {
      console.log(`[DEBUG] Incrementing Captcha Error for IP: ${ip}`);
      await this.authThrottler.incrementAttempt(email, ip, LockReason.CAPTCHA);
      return {
        message: 'Mã xác nhận không chính xác hoặc đã hết hạn',
        data: null,
        errorCode: AuthErrorCode.INVALID_CAPTCHA || 'INVALID_CAPTCHA',
      };
    }

    // Kiểm tra định dạng email và kiểm tra trùng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      email.trim() === '' ||
      !emailRegex.test(email) ||
      (await this.userModel.findOne({ email }))
    ) {
      return {
        message: 'Email không hợp lệ hoặc đã tồn tại.',
        data: null,
        errorCode: AuthErrorCode.EMAIL_ALREADY_REGISTERED,
      };
    }

    // Kiểm tra độ mạnh của mật khẩu
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!password || password.trim() === '' || !passwordRegex.test(password)) {
      return {
        message: 'Mật khẩu không hợp lệ.',
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }

    // Uỷ quyền repository xử lý đăng ký
    const result = await this.authRepo.handleRegister(dto, ip, userAgent);

    // Nếu đăng ký thành công → Reset locks
    if (result.errorCode === null) {
      await this.authThrottler.resetLock(email, ip);
    }

    return result;
  }

  // --- Đăng Nhập Người Dùng ---
  /**
   * Xử lý đăng nhập người dùng và sinh token
   */
  async login(dto: LoginDto, ip: string, userAgent?: string) {
    const { email, password, captchaId, captchaCode } = dto;

    // 0. Kiểm tra Captcha Lock từ Database
    const captchaLockCheck = await this.authThrottler.checkLock(email, ip, LockReason.CAPTCHA);
    if (captchaLockCheck.locked) {
      return {
        message: captchaLockCheck.message || 'Tài khoản bị khóa do sai mã xác nhận.',
        data: { lockUntil: captchaLockCheck.lockUntil, lockReason: captchaLockCheck.lockReason },
        errorCode: captchaLockCheck.errorCode || 'AUTH_LOCKED',
      };
    }

    // 0.1 Validate Captcha Server-Side
    const isCaptchaValid = await this.validateCaptcha(captchaId, captchaCode);
    if (!isCaptchaValid) {
      // Nhập sai Captcha → Tăng đếm lỗi ngay lập tức
      await this.authThrottler.incrementAttempt(email, ip, LockReason.CAPTCHA);
      return {
        message: 'Mã xác nhận không chính xác hoặc đã hết hạn',
        data: null,
        errorCode: AuthErrorCode.INVALID_CAPTCHA || 'INVALID_CAPTCHA',
      };
    }

    // Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === '' || !emailRegex.test(email)) {
      return {
        message: 'Email không hợp lệ',
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }

    // Kiểm tra mật khẩu không được rỗng
    if (!password || password.trim() === '') {
      return {
        message: 'Mật khẩu không hợp lệ',
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }

    // 1. Kiểm tra Password Lock từ Database
    const passwordLockCheck = await this.authThrottler.checkLock(email, ip, LockReason.PASSWORD);
    if (passwordLockCheck.locked) {
      return {
        message: passwordLockCheck.message || 'Tài khoản bị khóa do sai mật khẩu.',
        data: { lockUntil: passwordLockCheck.lockUntil, lockReason: passwordLockCheck.lockReason },
        errorCode: passwordLockCheck.errorCode || 'AUTH_LOCKED',
      };
    }

    // Tìm người dùng theo email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Tăng số lần sai password (chống dò email)
      await this.authThrottler.incrementAttempt(email, ip, LockReason.PASSWORD);
      return {
        message: 'Email chưa được đăng ký',
        data: null,
        errorCode: AuthErrorCode.USER_NOT_FOUND,
      };
    }

    // Uỷ quyền repository xử lý đăng nhập
    try {
      const result = await this.authRepo.handleLogin(user, password, ip, userAgent);

      // Đăng nhập thành công → Reset tất cả locks
      await this.authThrottler.resetLock(email, ip);

      return result;
    } catch {
      // Nếu đăng nhập thất bại (sai pass) → Tăng số lần sai password
      await this.authThrottler.incrementAttempt(email, ip, LockReason.PASSWORD);

      // Instead of throwing, catch and return error
      return {
        message: 'Thông tin đăng nhập không chính xác', // Generic message for security
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }
  }

  // --- Đăng Xuất Người Dùng ---
  /**
   * Xử lý đăng xuất bằng cách đánh dấu phiên là hết hạn (isExpired = true)
   */
  async logout(sessionId: string) {
    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
      return {
        message: 'Access Token không hợp lệ hoặc không được cung cấp',
        data: null,
        errorCode: AuthErrorCode.UNAUTHORIZED,
      };
    }

    // Uỷ quyền repository cập nhật trạng thái phiên (isExpired = true, expiresAt = now)
    return this.authRepo.logout(sessionId);
  }

  // --- Làm Mới Access Token ---
  /**
   * Xác thực refresh token và cấp lại access token mới, không cần access token
   */
  async refreshAccessToken(refreshToken: string, res: Response) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh Token không được cung cấp hoặc không hợp lệ');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
    }

    const sessionId = payload.sessionId;
    if (!sessionId) {
      throw new UnauthorizedException('Phiên đăng nhập không tồn tại hoặc đã bị thu hồi');
    }

    const result = await this.authRepo.refreshTokens(sessionId);

    // Kiểm tra kết quả từ repository
    if (!result.data || result.errorCode) {
      throw new UnauthorizedException(
        result.message || 'Phiên đăng nhập không tồn tại hoặc đã bị thu hồi',
      );
    }

    if (result.data) {
      const tokens = result.data as { accessToken?: string; refreshToken?: string };
      const accessMaxAge = this.jwtService.getAccessExpiresInMs();
      const refreshMaxAge = this.jwtService.getRefreshExpiresInMs();
      setAuthCookies(res, tokens, accessMaxAge, refreshMaxAge);
    }

    return result;
  }
}
