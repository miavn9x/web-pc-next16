import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async create(createCouponDto: any): Promise<Coupon> {
    const dto = createCouponDto as { code?: string; [key: string]: any }; // Cast for type safety
    // Auto-generate code if not provided
    if (!dto.code) {
      dto.code = this.generateCouponCode();
    }

    // Check duplication
    const existing = await this.couponModel.findOne({ code: dto.code });
    if (existing) {
      throw new BadRequestException('Mã giảm giá đã tồn tại');
    }

    const createdCoupon = new this.couponModel(dto);
    return createdCoupon.save();
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() }).exec();
    if (!coupon) {
      throw new NotFoundException(`Mã giảm giá không tồn tại`);
    }
    return coupon;
  }

  async update(id: string, updateCouponDto: any): Promise<Coupon> {
    const update = updateCouponDto as UpdateQuery<CouponDocument>;
    const existing = await this.couponModel.findByIdAndUpdate(id, update, { new: true });
    if (!existing) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return existing;
  }

  async remove(id: string): Promise<void> {
    const result = await this.couponModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
  }

  private generateCouponCode(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `KM${result}`; // Prefix KM
  }
}
