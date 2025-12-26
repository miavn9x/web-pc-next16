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
} from '@nestjs/common';
import { AdvertisementService } from '../services/advertisement.service';
import { CreateAdvertisementDto } from '../dtos/create-advertisement.dto';
import { UpdateAdvertisementDto } from '../dtos/update-advertisement.dto';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly adService: AdvertisementService) {}

  // --- Tạo mới (Admin only) ---
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateAdvertisementDto) {
    return this.adService.create(dto);
  }

  // --- Lấy danh sách (Public) ---
  // Hỗ trợ filter: ?position=left&isActive=true
  @Get()
  async findAll(@Query('position') position?: string, @Query('isActive') isActive?: string) {
    const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.adService.findAll({ position, isActive: isActiveBool });
  }

  // --- Chi tiết (Public) ---
  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.adService.findOne(code);
  }

  // --- Cập nhật (Admin only) ---
  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('code') code: string, @Body() dto: UpdateAdvertisementDto) {
    return this.adService.update(code, dto);
  }

  // --- Xóa (Admin only) ---
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('code') code: string) {
    return this.adService.delete(code);
  }
}
