import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt.guard';
import { UserRole } from 'src/modules/users/constants/user-role.enum';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderService } from '../services/order.service';

@UseInterceptors(CacheInterceptor)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // --- Public API: Tạo đơn hàng ---
  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  // --- Admin: Lấy danh sách đơn hàng có phân trang ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @CacheTTL(120)
  async getOrderList(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.orderService.getOrderList(+page, +limit);
  }

  // --- Admin: Lọc đơn hàng theo orderStatus  ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('filter')
  @CacheTTL(120)
  async filterOrders(
    @Query('orderStatus') orderStatus: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.orderService.filterOrders(orderStatus, +page, +limit);
  }

  // --- Admin: Tìm đơn hàng theo mã ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('search')
  @CacheTTL(120)
  async searchOrdersByCode(
    @Query('code') code: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.orderService.searchOrderByCode(code, +page, +limit);
  }

  // --- Admin: Thống kê khách hàng ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('customers')
  @CacheTTL(120)
  async getCustomersStats(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('search') search?: string,
  ) {
    return this.orderService.getCustomersStats(+page, +limit, search);
  }

  // --- Admin: Lấy chi tiết đơn hàng ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':code')
  async getOrderDetail(@Param('code') code: string) {
    return this.orderService.getOrderDetail(code);
  }

  // --- Admin: Cập nhật trạng thái đơn hàng ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':code')
  async updateOrderStatus(@Param('code') code: string, @Body('orderStatus') orderStatus: string) {
    return this.orderService.updateOrderStatus(code, orderStatus);
  }

  // --- Admin: Xoá đơn hàng ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':code')
  async deleteOrder(@Param('code') code: string) {
    return this.orderService.deleteOrder(code);
  }
}
