import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import {
  ConfirmVendorAccount,
  CreateVendorDto,
  VendorProfileUpdate,
  VendorServiceAvailableDto,
} from './dto/create-vendor.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthCredentialSignInDto } from 'src/auth/dto/auth.dto';
import { Vendor } from 'src/models/vendor.schema';
import { GetVendor } from './getVendor/get-vendor.decorator';
import {
  ProductCoverImages,
  VendorCoverImages,
} from 'src/utility/file.upload.utility';
import { FoodService } from 'src/food/food.service';
import { Food } from 'src/models/food.schema';
import { CreateFoodDto } from 'src/food/dto/create-food.dto';

@Controller('vendor')
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly foodService: FoodService,
  ) {}

  @Post('/signin')
  async signin(@Body() authCredentialSignInDto: AuthCredentialSignInDto) {
    return await this.vendorService.SignIn(authCredentialSignInDto);
  }

  @Post('/signup')
  async signup(@Body() createVendorInput: CreateVendorDto) {
    return await this.vendorService.SignUp(createVendorInput);
  }

  @Post('/confirm')
  @UseGuards(AuthGuard())
  async confirm(
    @GetVendor() vendor: Vendor,
    @Body() confirmVendorAccount: ConfirmVendorAccount,
  ): Promise<string> {
    return this.vendorService.Confirm(confirmVendorAccount, vendor);
  }

  @Get('/profile')
  @UseGuards(AuthGuard())
  async vendorProfile(@GetVendor() vendor: Vendor) {
    return this.vendorService.vendorProfile(vendor);
  }

  @Patch('/profile')
  @UseGuards(AuthGuard())
  async vendorProfileUpdate(
    @GetVendor() vendor: Vendor,
    @Body() vendorProfileUpdate: VendorProfileUpdate,
  ) {
    console.log();
    return this.vendorService.vendorProfileUpdate(vendor, vendorProfileUpdate);
  }

  @Post('/cover-images')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FilesInterceptor('files[]', 20, {
      storage: VendorCoverImages,
    }),
  )
  uploadFile(
    @GetVendor() vendor: Vendor,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.vendorService.vendorCoverImages(vendor, files);
  }

  @Patch('/service')
  @UseGuards(AuthGuard())
  async vendorServiceUpdate(
    @GetVendor() vendor: Vendor,
    @Body() vendorServiceDto: VendorServiceAvailableDto,
  ): Promise<Vendor> {
    return this.vendorService.vendorServiceUpdate(vendor, vendorServiceDto);
  }

  @Post('/food')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FilesInterceptor('images[]', 20, {
      storage: ProductCoverImages,
    }),
  )
  async VendorAddFood(
    @GetVendor() vendor: Vendor,
    @Body() createFoodDto: CreateFoodDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<Food> {
    return this.foodService.addFood(vendor, createFoodDto, images);
  }

  @Get('/foods')
  @UseGuards(AuthGuard())
  async VendorFoods(@GetVendor() vendor: Vendor): Promise<Food[]> {
    return this.foodService.findAllFoods(vendor);
  }

  @Get('/food/:id')
  @UseGuards(AuthGuard())
  async VendorFoodById(
    @GetVendor() vendor: Vendor,
    @Param() id: string,
  ): Promise<Food> {
    return this.foodService.findOneFood(vendor, id);
  }
}
