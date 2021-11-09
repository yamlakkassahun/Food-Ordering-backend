/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.schema';
import { AuthCredentialDto, AuthCredentialSignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/payload.interface';
import { Role } from 'src/models/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async FindUser(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async SignUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { email, phone, password, address, firstName, lastName } =
      authCredentialDto;
    //generate the salt to hash password
    const salt = await bcrypt.genSalt(10);
    //this will generate the hashed password
    const hashPassword = await bcrypt.hash(password, salt);

    const existingAdmin = await this.FindUser(email);

    if (existingAdmin !== null) {
      throw new ConflictException('Email Already Exists');
    }
    try {
      const user = this.userModel.create({
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        address: address,
        salt: salt,
        email: email,
        password: hashPassword,
        role: Role.ADMIN,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async SignIn(
    authCredentialSignInDto: AuthCredentialSignInDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialSignInDto;

    const user = await this.FindUser(email);
    const role = Role.ADMIN;

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email, role };
      
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please Check you Login Credentials');
    }
  }
}
