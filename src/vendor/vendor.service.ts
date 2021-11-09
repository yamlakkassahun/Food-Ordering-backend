/* eslint-disable prettier/prettier */
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCredentialSignInDto } from 'src/auth/dto/auth.dto';
import { JwtPayload } from 'src/auth/interface/payload.interface';
import { Food } from 'src/models/food.schema';
import { Role } from 'src/models/role.enum';
import { Vendor, VendorDocument } from 'src/models/vendor.schema';
import { GeneratePassword, GenerateSalt, ValidatePassword } from 'src/utility/password.utility';
import {
  ConfirmVendorAccount,
  CreateVendorDto,
  VendorProfileUpdate,
  VendorServiceAvailableDto,
} from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    private jwtService: JwtService,
  ) {}

  // Vendor logic
  async FindVendor(email: string): Promise<Vendor> {
    const vendor = await this.vendorModel.findOne({ email: email });
    return vendor;
  }

  async createVendor(createVendorInput: CreateVendorDto): Promise<Vendor> {
    const {
      name,
      address,
      pincode,
      category,
      email,
      password,
      ownerName,
      phone,
    } = createVendorInput;

    const existingVendor = await this.FindVendor(email);

    if (existingVendor !== null) {
      throw new ConflictException('Vendor Already Exists with This Email');
    }

    //generate a salt
    const salt = await GenerateSalt();

    //generate a password
    const vendorPassword = await GeneratePassword(password, salt);

    try {
      const vendor = this.vendorModel.create({
        name: name,
        address: address,
        pincode: pincode,
        category: category,
        email: email,
        emailVerification: false,
        password: vendorPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        role: Role.VENDOR,
        serviceAvailable: false,
        coverImage: [],
        foods: [],
        lat: 0,
        lng: 0,
        code: Math.random().toString(36).substring(2, 15),
      });
      return vendor;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async allVendors(): Promise<Vendor[]> {
    try {
      const vendors = await this.vendorModel
        .find({})
        .populate('foods', null, Food.name)
        .exec();
      if (vendors != null) {
        return vendors;
      }
    } catch (error) {
      throw new HttpException('Sorry no vendors Found!', 404);
    }
  }

  async getVendorById(id): Promise<Vendor> {
    try {
      const vendor = await this.vendorModel.findOne({ id });
      if (vendor != null) {
        return vendor;
      }
    } catch (error) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  async SignIn(
    authCredentialSignInDto: AuthCredentialSignInDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialSignInDto;

    const user = await this.FindVendor(email);

    if (user && (await ValidatePassword(password, user.password))) {
      const role = user.role;
      const payload: JwtPayload = { email, role };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please Check you Login Credentials');
    }
  }

  async Confirm(
    confirmVendorAccount: ConfirmVendorAccount,
    vendor: Vendor,
  ): Promise<string> {
    const { conformation } = confirmVendorAccount;
    const { email, code } = vendor;

    if (code !== conformation) {
      throw new HttpException('Invalid Conformation Code!', 404);
    }

    try {
      const vendor = await this.vendorModel.findOne({ email: email });
      vendor.emailVerification = true;
      await vendor.save();
      return 'Account Verified';
    } catch (e) {
      throw new HttpException('Sorry Account was not Found!', 404);
    }
  }

  async vendorProfile(vendor: Vendor): Promise<Vendor> {
    const email = vendor.email;

    try {
      const vendor = await this.vendorModel
        .findOne({ email: email })
        .populate('foods', null, Food.name)
        .exec();
      if (vendor != null) {
        return vendor;
      }
    } catch (error) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  async vendorProfileUpdate(
    vendor: Vendor,
    vendorProfileUpdate: VendorProfileUpdate,
  ): Promise<Vendor> {
    const { category, name, address, phone, about } = vendorProfileUpdate;
    try {
      const existingVendor = await this.vendorModel.findOne({
        email: vendor.email,
      });
      if (vendor != null) {
        existingVendor.name = name;
        existingVendor.address = address;
        existingVendor.phone = phone;
        existingVendor.about = about;
        existingVendor.category = category;
        const savedResult = await existingVendor.save();
        return savedResult;
      }
    } catch (error) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  async vendorCoverImages(
    vendor: Vendor,
    files: Array<Express.Multer.File>,
  ): Promise<Vendor> {
    try {
      const existingVendor = await this.vendorModel.findOne({
        email: vendor.email,
      });
      if (existingVendor != null) {
        //this will have an array of files but we need the file names of the images
        const images = files.map((file: Express.Multer.File) => file.filename);

        //then this will push the newly created food to the vendor
        existingVendor.coverImages.push(...images);
        const savedResult = await existingVendor.save();
        return savedResult;
      }
    } catch (error) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  async vendorServiceUpdate(
    vendor: Vendor,
    vendorServiceDto: VendorServiceAvailableDto,
  ): Promise<Vendor> {
    const { lat, lng, serviceAvailable } = vendorServiceDto;
    try {
      const existingVendor = await this.vendorModel.findOne({
        email: vendor.email,
      });
      if (existingVendor != null) {
        existingVendor.serviceAvailable = serviceAvailable;
        existingVendor.lat = lat;
        existingVendor.lng = lng;
        const vendor = await existingVendor.save();
        return vendor;
      }
    } catch (error) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  // async addProduct(
  //   vendor: Vendor,
  //   createItemDto: CreateItemDto,
  //   images: Array<Express.Multer.File>,
  // ): Promise<Item> {
  //   const { name, description, category, itemType, price } = createItemDto;
  //   const image = images.map((file: Express.Multer.File) => file.filename);

  //   try {
  //     const existingVendor = await this.vendorModel.findOne({
  //       email: vendor.email,
  //     });
  //     if (existingVendor != null) {
  //       const item = this.itemModel.create({
  //         vendorId: existingVendor._id,
  //         name: name,
  //         category: category,
  //         description: description,
  //         itemType: itemType,
  //         price: price,
  //         rating: 1,
  //         images: image,
  //       });

  //       existingVendor.items.push(await item);
  //       await existingVendor.save();
  //       return item;
  //     }
  //     throw new HttpException('Sorry Some Error Occur', 404);
  //   } catch (error) {
  //     throw new HttpException('Sorry no vendor Found!', 404);
  //   }
  // }
  create(createVendorDto: CreateVendorDto) {
    return 'This action adds a new vendor';
  }

  findAll() {
    return `This action returns all vendor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
