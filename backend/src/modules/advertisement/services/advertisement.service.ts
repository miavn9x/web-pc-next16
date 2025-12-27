import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advertisement, AdvertisementDocument } from '../schemas/advertisement.schema';
import { CreateAdvertisementDto } from '../dtos/create-advertisement.dto';
import { UpdateAdvertisementDto } from '../dtos/update-advertisement.dto';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(Advertisement.name)
    private readonly adModel: Model<AdvertisementDocument>,
  ) {}

  // --- Tạo quảng cáo mới ---
  async create(dto: CreateAdvertisementDto) {
    const code = `ADV${Date.now()}`; // Simple unique code generation
    const created = new this.adModel({ ...dto, code });
    const saved = await created.save();
    return {
      message: 'Tạo quảng cáo thành công',
      data: saved,
      errorCode: null,
    };
  }

  // --- Lấy danh sách (có filter) ---
  async findAll(query: { position?: string; isActive?: boolean }) {
    const filter: any = {};
    if (query.position) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      filter.position = query.position;
    }
    if (query.isActive !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      filter.isActive = query.isActive;
    }

    const items = await this.adModel
      .find(filter) // eslint-disable-line @typescript-eslint/no-unsafe-argument
      .sort({ priority: -1, updatedAt: -1 }) // Ưu tiên cao nhất lên đầu
      .exec();

    return {
      message: 'Lấy danh sách quảng cáo thành công',
      data: items,
      errorCode: null,
    };
  }

  // --- Chi tiết ---
  async findOne(code: string) {
    const item = await this.adModel.findOne({ code }).exec();
    if (!item) {
      throw new Error('Advertisement not found');
    }
    return {
      message: 'Lấy chi tiết quảng cáo thành công',
      data: item,
      errorCode: null,
    };
  }

  // --- Cập nhật ---
  async update(code: string, dto: UpdateAdvertisementDto) {
    const updated = await this.adModel.findOneAndUpdate({ code }, dto, { new: true }).exec();
    if (!updated) {
      throw new Error('Advertisement not found');
    }
    return {
      message: 'Cập nhật quảng cáo thành công',
      data: updated,
      errorCode: null,
    };
  }

  // --- Xóa ---
  async delete(code: string) {
    const deleted = await this.adModel.findOneAndDelete({ code }).exec();
    if (!deleted) {
      throw new Error('Advertisement not found');
    }
    return {
      message: 'Xóa quảng cáo thành công',
      data: deleted,
      errorCode: null,
    };
  }
}
