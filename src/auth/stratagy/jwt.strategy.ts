/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/models/user.schema';
import { Vendor } from 'src/models/vendor.schema';
import { JwtPayload } from '../interface/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    @InjectModel('Vendor')
    private vendorModel: Model<Vendor>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'sdahsgdahsgdasdhgasjhdgasdhgajdhasdhasgdjahsgdahsgd',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { email } = payload;
    const user: User = await this.userModel.findOne({ email });
    const vendor: Vendor = await this.vendorModel.findOne({ email });

    if (!user && !vendor) {
      throw new UnauthorizedException();
    } else if (!vendor) {
      return user;
    } else {
      return vendor;
    }
  }
}
