// --- Import Thư Viện NestJS và Passport ---
// Injectable: Đánh dấu class có thể được inject
import { Injectable } from '@nestjs/common';
// PassportStrategy: Base class để định nghĩa chiến lược xác thực
import { PassportStrategy } from '@nestjs/passport';
// ExtractJwt, Strategy: Công cụ trích xuất và xử lý JWT từ request
import { ExtractJwt, Strategy } from 'passport-jwt';

// --- Import Kiểu Dữ Liệu Nội Bộ ---
// JwtPayload: Định nghĩa kiểu dữ liệu của payload JWT
import { JwtPayload } from '../types/jwt.type';

// --- Định Nghĩa Strategy Xác Thực JWT ---

// --- Import Mongoose ---
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthSession, AuthSessionDocument } from '../../../modules/auth/schemas/auth.schema';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,
  ) {
    // --- Load biến môi trường JWT ---
    const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const accessExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN;
    const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
    const refreshExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;

    if (!accessSecret || !accessExpiresIn || !refreshSecret || !refreshExpiresIn) {
      throw new Error(
        `[JWT] [${new Date().toLocaleString()}] ❌ Thiếu biến môi trường JWT (ACCESS hoặc REFRESH). Vui lòng kiểm tra .env`,
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies?: { accessToken?: string } }) =>
          req?.cookies?.accessToken || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
  }

  // --- Validate Payload (Updated) ---
  // Kiểm tra session trong DB để đảm bảo session chưa bị xóa/hết hạn
  async validate(payload: JwtPayload) {
    const { sessionId } = payload;

    // Nếu không có sessionId trong payload, coi như không hợp lệ
    if (!sessionId) {
      throw new UnauthorizedException('Token invalid: Missing Session ID');
    }

    // Tìm session trong database
    const session = await this.authSessionModel.findOne({ sessionId, isExpired: false });

    // Nếu không tìm thấy session hoặc session đã hết hạn trong DB -> Reject
    if (!session) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    return payload;
  }
}
