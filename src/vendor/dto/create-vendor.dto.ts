import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;
  @IsString()
  @ApiProperty({ type: String, description: 'ownerName' })
  ownerName: string;
  @IsArray()
  @ApiProperty({ type: [String], description: 'foodType' })
  foodType: string[];
  @IsString()
  @ApiProperty({ type: String, description: 'pincode' })
  pincode: string;
  @IsString()
  @ApiProperty({ type: String, description: 'address' })
  address: string;
  @IsString()
  @ApiProperty({ type: String, description: 'phone' })
  phone: string;
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;
  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords is weak.Password must contain upper case letter, lower case letter and number or special character',
  })
  password: string;
}

export class ConfirmVendorAccount {
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  conformation: string;
}

export class VendorProfileUpdate {
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;
  @IsArray()
  @ApiProperty({ type: [String], description: 'foodType' })
  foodType: string[];
  @IsString()
  @ApiProperty({ type: String, description: 'address' })
  address: string;
  @IsString()
  @ApiProperty({ type: String, description: 'phone' })
  phone: string;
  @IsString()
  @ApiProperty({ type: String, description: 'about' })
  about: string;
}

export class VendorServiceAvailableDto {
  @IsString()
  @ApiProperty({ type: String, description: 'lat' })
  lat: string;
  @IsString()
  @ApiProperty({ type: String, description: 'lng' })
  lng: string;
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'serviceAvailable' })
  serviceAvailable: boolean;
}

export class CreateItemDto {
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;
  @IsString()
  @ApiProperty({ type: String, description: 'description' })
  description: string;
  @IsString()
  @ApiProperty({ type: String, description: 'category' })
  category: string;
  @IsString()
  @ApiProperty({ type: String, description: 'itemType' })
  itemType: string;
  @IsString()
  @ApiProperty({ type: String, description: 'price' })
  price: string;
}
