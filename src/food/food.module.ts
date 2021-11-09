import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from 'src/models/food.schema';
import { Vendor, VendorSchema } from 'src/models/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
      { name: Vendor.name, schema: VendorSchema },
    ]),
  ],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
