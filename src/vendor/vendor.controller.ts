import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import {
  ConfirmVendorAccount,
  VendorProfileUpdate,
  VendorServiceAvailableDto,
} from './dto/create-vendor.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthCredentialSignInDto } from 'src/auth/dto/auth.dto';
import { Vendor } from 'src/models/vendor.schema';
import { GetVendor } from './getVendor/get-vendor.decorator';
import { VendorCoverImages } from 'src/utility/file.upload.utility';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post('/signin')
  async signin(@Body() authCredentialSignInDto: AuthCredentialSignInDto) {
    return await this.vendorService.SignIn(authCredentialSignInDto);
  }

  @Post('/confirm')
  @UseGuards(AuthGuard())
  async confirm(
    @GetVendor() vendor: Vendor,
    @Body() confirmVendorAccount: ConfirmVendorAccount,
  ): Promise<string> {
    return this.vendorService.Confirm(confirmVendorAccount, vendor);
  }

  @Post('/user')
  @UseGuards(AuthGuard())
  async test(@GetVendor() vendor: Vendor) {
    console.log(vendor);
    return vendor;
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

  @Post('/file')
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
    // Create a form data object
    // return files.map((files: Express.Multer.File) => files.filename);
  }

  @Patch('/service')
  @UseGuards(AuthGuard())
  async vendorServiceUpdate(
    @GetVendor() vendor: Vendor,
    @Body() vendorServiceDto: VendorServiceAvailableDto,
  ): Promise<Vendor> {
    return this.vendorService.vendorServiceUpdate(vendor, vendorServiceDto);
  }

  // @Post('/product')
  // @UseGuards(AuthGuard())
  // @UseInterceptors(
  //   FilesInterceptor('images[]', 10, {
  //     storage: ProductCoverImages,
  //   }),
  // )
  // async addProduct(
  //   @GetVendor() vendor: Vendor,
  //   @Body() createItemDto: CreateItemDto,
  //   @UploadedFiles() images: Array<Express.Multer.File>,
  // ): Promise<Item> {
  //   return this.vendorService.addProduct(vendor, createItemDto, images);
  // }
}
