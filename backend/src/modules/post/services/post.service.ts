// --- [Thư viện] ---
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdateOrderDto } from '../dtos/update-post.dto';
import { Post, PostDocument } from '../schemas/post.schema';

export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  // --- Tạo bài viết ---
  async create(dto: CreatePostDto) {
    const now = new Date();
    const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getFullYear().toString().slice(-2)}`;
    let code = '';
    let exist = true;

    while (exist) {
      const random = Math.floor(100000 + Math.random() * 900000);
      code = `POST${datePart}${random}`;
      const existed = await this.postModel.exists({ code });
      exist = !!existed;
    }

    const created = new this.postModel({ ...dto, code });
    const saved = await created.save();
    return {
      message: 'Tạo bài viết thành công',
      data: saved,
      errorCode: null,
    };
  }

  // --- Cập nhật bài viết ---
  async update(code: string, dto: UpdateOrderDto) {
    const exists = await this.postModel.exists({ code });
    if (!exists) {
      return {
        message: 'Không tìm thấy bài viết',
        data: null,
        errorCode: 'POST_NOT_FOUND',
      };
    }

    const updated = await this.postModel.findOneAndUpdate({ code }, dto, {
      new: true,
    });

    return {
      message: 'Cập nhật bài viết thành công',
      data: updated,
      errorCode: null,
    };
  }

  // --- Lấy danh sách toàn bộ bài viết (có phân trang) ---
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.postModel
        .find({}, 'code cover title description -_id')
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.postModel.countDocuments(),
    ]);

    return {
      message: 'Lấy danh sách bài viết thành công',
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
        },
      },
      errorCode: null,
    };
  }

  // --- Lấy chi tiết bài viết ---
  async findOne(code: string) {
    const post = await this.postModel.findOne({ code }).lean();
    if (!post) {
      return {
        message: 'Không tìm thấy bài viết',
        data: null,
        errorCode: 'POST_NOT_FOUND',
      };
    }

    return {
      message: 'Lấy chi tiết bài viết thành công',
      data: post,
      errorCode: null,
    };
  }

  // --- Xoá bài viết ---
  async delete(code: string) {
    const deleted = await this.postModel.findOneAndDelete({ code });
    if (!deleted) {
      return {
        message: 'Không tìm thấy bài viết',
        data: null,
        errorCode: 'POST_NOT_FOUND',
      };
    }

    return {
      message: 'Xoá bài viết thành công',
      data: deleted,
      errorCode: null,
    };
  }
}
