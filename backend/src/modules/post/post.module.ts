// --- [Thư viện] ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// --- [Controller & Service] ---
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';

// --- [Schema] ---
import { CacheModule } from '@nestjs/cache-manager';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CacheModule.register(),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
