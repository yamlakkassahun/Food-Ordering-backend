import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { Vendor } from './entities/vendor.entity';
import { VendorSchema } from 'src/models/vendor.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FoodModule } from 'src/food/food.module';
import { Food, FoodSchema } from 'src/models/food.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Food.name, schema: FoodSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'sdahsgdahsgdasdhgasjhdgasdhgajdhasdhasgdjahsgdahsgd',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    FoodModule,
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
