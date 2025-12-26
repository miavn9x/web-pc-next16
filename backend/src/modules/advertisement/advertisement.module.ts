import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertisement, AdvertisementSchema } from './schemas/advertisement.schema';
import { AdvertisementController } from './controllers/advertisement.controller';
import { AdvertisementService } from './services/advertisement.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Advertisement.name, schema: AdvertisementSchema }])],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  exports: [AdvertisementService],
})
export class AdvertisementModule {}
