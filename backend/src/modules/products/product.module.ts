import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { Category, CategorySchema } from './categories/schemas/category.schema';
import { ProductService } from './services/product.service';
import { AdminProductController, ProductController } from './controllers/product.controller';
import { CategoryModule } from './categories/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CategoryModule,
  ],
  controllers: [AdminProductController, ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
