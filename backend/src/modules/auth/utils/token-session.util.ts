import { JwtService } from '../../../common/jwt/services/jwt.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { AuthSessionDocument } from '../schemas/auth.schema';
import { generateSessionId } from './generate-session-id';

interface CreateTokenSessionParams {
  user: UserDocument;
  jwtService: JwtService;
  authSessionModel: {
    create: (input: Partial<AuthSessionDocument>) => Promise<AuthSessionDocument>;
  };
  ipAddress?: string; // Địa chỉ IP của người dùng
  userAgent?: string; // User-Agent của trình duyệt
}

export async function createTokenAndSession({
  user,
  jwtService,
  authSessionModel,
  ipAddress,
  userAgent,
}: CreateTokenSessionParams) {
  const sessionId = generateSessionId();

  const payload = {
    sub: user._id.toString(),
    sessionId,
    email: user.email,
    roles: user.roles,
  };

  const { accessToken, refreshToken } = jwtService.signTokens(payload);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + jwtService.getRefreshExpiresInMs());

  await authSessionModel.create({
    sessionId,
    email: user.email,
    userId: user._id,
    refreshToken,
    ipAddress, // Lưu IP
    userAgent, // Lưu User-Agent
    loginAt: now,
    lastRefreshedAt: now,
    expiresAt,
  });

  return { accessToken, refreshToken, sessionId };
}
