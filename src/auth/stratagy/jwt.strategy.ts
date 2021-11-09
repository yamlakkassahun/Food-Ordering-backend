import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/models/user.schema';
import { JwtPayload } from '../interface/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'sdahsgdahsgdasdhgasjhdgasdhgajdhasdhasgdjahsgdahsgd',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user: User = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
