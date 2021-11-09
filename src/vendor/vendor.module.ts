import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { Vendor } from './entities/vendor.entity';
import { VendorSchema } from 'src/models/vendor.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Vendor.name, schema: VendorSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'sdahsgdahsgdasdhgasjhdgasdhgajdhasdhasgdjahsgdahsgd',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
