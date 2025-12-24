// ===============================
// = Module: Đơn hàng (OrdersModule) =
// = Khai báo module quản lý đơn hàng, gồm controller, service, repository, schema =
// ===============================

// --- Imports ---
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { OrderController } from './controllers/order.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderService } from './services/order.service';
import { CouponModule } from '../coupons/coupon.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CacheModule.register(),
    MailModule,
    CouponModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
