import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers/product.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductService } from './services/product.service';

// --- [Module Definition] ---
@Module({
  // --- [Schema Mongoose] ---
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CacheModule.register(),
  ],

  // --- [Controllers] ---
  controllers: [ProductController],

  // --- [Providers] ---
  providers: [ProductService],
})
export class ProductModule {}
