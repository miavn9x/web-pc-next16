// --- 📦 Import Thư Viện Cần Thiết ---
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { Request, Response } from 'express';

// --- 🔐 Import Guard & Decorator ---
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

// --- 🧾 Import Kiểu Dữ Liệu & Dịch Vụ ---
import { JwtService } from 'src/common/jwt/services/jwt.service';
import { JwtPayload } from 'src/common/jwt/types/jwt.type';
import { AuthService } from 'src/modules/auth/services/auth.service';

// --- 📥 Import DTOs ---
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';

// --- 📤 Import Kiểu Trả Về ---
import { StandardResponse } from 'src/common/interfaces/response.interface';
import { AuthResponse } from 'src/modules/auth/dtos/auth-response.dto';

// --- 📂 Import Utility ---
import { setAuthCookies } from 'src/modules/auth/utils/set-cookie.util';

// --- 🔧 AuthController - Quản Lý Xác Thực ---
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // --- [POST] /auth/register - Đăng Ký Người Dùng ---
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Giới hạn 10 lần/phút cho đăng ký (cho phép retry)
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: StandardResponse<AuthResponse> = await this.authService.register(
      dto,
      ip,
      userAgent,
    );

    const accessMaxAge = this.jwtService.getAccessExpiresInMs();
    const refreshMaxAge = this.jwtService.getRefreshExpiresInMs();

    if (result.data) {
      const tokens = result.data as { accessToken?: string; refreshToken?: string };
      (
        setAuthCookies as (
          res: Response,
          tokens: { accessToken?: string; refreshToken?: string },
          accessMaxAge: number,
          refreshMaxAge: number,
        ) => void
      )(res, tokens, accessMaxAge, refreshMaxAge);
    }

    return {
      message: result.message,
      data: null,
      errorCode: result.errorCode,
    };
  }

  // --- [POST] /auth/login - Đăng Nhập Người Dùng ---
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // Giới hạn 15 lần/phút (cho phép retry nhiều lần)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: StandardResponse<AuthResponse> = await this.authService.login(dto, ip, userAgent);

    const accessMaxAge = this.jwtService.getAccessExpiresInMs();
    const refreshMaxAge = this.jwtService.getRefreshExpiresInMs();

    if (result.data) {
      const tokens = result.data as { accessToken?: string; refreshToken?: string };
      (
        setAuthCookies as (
          res: Response,
          tokens: { accessToken?: string; refreshToken?: string },
          accessMaxAge: number,
          refreshMaxAge: number,
        ) => void
      )(res, tokens, accessMaxAge, refreshMaxAge);
    }

    return {
      message: result.message,
      data: null,
      errorCode: result.errorCode,
    };
  }

  // --- [POST] /auth/logout - Đăng Xuất Người Dùng ---
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    const result: StandardResponse<AuthResponse> = await this.authService.logout(user.sessionId);

    if (result.data?.shouldClearCookie) {
      const isProd = process.env.NODE_ENV === 'production';

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        // domain: '.simhubglobal.com',
      });

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        // domain: '.simhubglobal.com',
      });
    }

    return {
      message: result.message,
      data: {},
      errorCode: result.errorCode,
    };
  }

  // --- [POST] /auth/re-access-token - Làm Mới Access Token ---
  @HttpCode(HttpStatus.OK)
  @Post('re-access-token')
  async refreshAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken as string;
    const result: StandardResponse<AuthResponse> = await this.authService.refreshAccessToken(
      refreshToken,
      res,
    );

    return {
      message: result.message,
      data: null,
      errorCode: result.errorCode,
    };
  }

  // --- [POST] /auth/captcha - Lấy mã Captcha mới (với kiểm tra lock) ---
  @Post('captcha')
  @HttpCode(HttpStatus.OK)
  async getCaptcha(@Body('email') email?: string, @Ip() ip?: string) {
    // 1. Nếu có email → Kiểm tra lock trước khi trả captcha
    if (email && ip) {
      const lockCheck = await this.authService.checkCaptchaLock(email, ip);

      if (lockCheck.locked) {
        // Đang bị lock → Trả lock info, KHÔNG trả captcha
        return {
          message: lockCheck.message || 'Tài khoản tạm thời bị khóa.',
          data: null,
          errorCode: 'AUTH_LOCKED',
          lockInfo: {
            locked: true,
            lockUntil: lockCheck.lockUntil,
            lockReason: lockCheck.lockReason,
            lockCount: lockCheck.lockCount,
          },
        };
      }
    }

    // 2. Không bị lock hoặc không có email → Generate captcha bình thường
    const result = await this.authService.generateCaptcha();
    return {
      message: 'Lấy captcha thành công',
      data: result,
      errorCode: null,
      lockInfo: {
        locked: false,
      },
    };
  }
}
