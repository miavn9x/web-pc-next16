import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Export để ProductModule dùng
})
export class CategoryModule {}
