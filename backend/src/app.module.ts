// --- Import Thư Viện Bên Thứ Ba ---
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from './common/jwt/jwt.module';

// --- Import Module Nội Bộ ---
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PostModule } from './modules/post/post.module';
import { ProductModule } from './modules/products/product.module';
import { UsersModule } from './modules/users/user.module';
import { MediaModule } from './modules/media/media.module';
import { CouponModule } from './modules/coupons/coupon.module';

// --- Cấu Hình Module Gốc AppModule ---
@Module({
  // --- Module Con ---
  imports: [
    CacheModule.register({
      ttl: 60, // default TTL
      max: 100, // optional: max number of items
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    // --- Cấu Hình Biến Môi Trường ---
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // --- Kết Nối CSDL MongoDB ---
    MongooseModule.forRoot(process.env.MONGO_URI || '', {}),

    // --- Cấu Hình Bảo Mật (JWT) ---
    JwtModule,

    // --- Module Ứng Dụng Chính ---
    AuthModule,
    UsersModule,
    ProductModule,
    PostModule,
    OrdersModule,
    OrdersModule,
    MediaModule,
    CouponModule,
  ],
  // --- Controller ---
  controllers: [AppController],
  // --- Service hoặc Provider ---
  providers: [AppService],
})
export class AppModule {}
