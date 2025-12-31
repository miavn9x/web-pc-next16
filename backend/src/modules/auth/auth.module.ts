// --- Import Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// --- Import Module Nội Bộ ---
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '../../common/jwt/jwt.module';

// --- Import Schema ---
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthSession, AuthSessionSchema } from './schemas/auth.schema';
import { AccountLock, AccountLockSchema } from './schemas/account-lock.schema';

// --- Import Controller ---
import { AuthController } from 'src/modules/auth/controllers/auth.controller';

// --- Import Repository & Service ---
// --- Import Repository & Service ---
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { AuthThrottlerService } from './services/auth-throttler.service';
import { JwtStrategy } from '../../common/jwt/strategies/jwt.strategy';

// --- Định Nghĩa Module Xác Thực ---
@Module({
  // --- Import Các Module Cần Thiết ---
  imports: [
    // Cấu hình schema cho MongoDB
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthSession.name, schema: AuthSessionSchema },
      { name: AccountLock.name, schema: AccountLockSchema },
    ]),
    // Cấu hình JWT cho xác thực
    JwtModule,
    CacheModule.register(),
    // Cấu hình Throttler cho module này (để dùng @Throttle)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10, // Default limit nếu không set cụ thể
      },
    ]),
  ],
  // --- Khai Báo Controller ---
  controllers: [AuthController],
  // --- Khai Báo Provider ---
  providers: [AuthService, AuthRepository, JwtStrategy, AuthThrottlerService],
})
export class AuthModule {}
