/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialDto {
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' }) // this will give the schema to the swagger api
  email: string;

  @IsString()
  @ApiProperty({ type: String, description: 'address' }) // this will give the schema to the swagger api
  address: string;

  @IsString()
  @ApiProperty({ type: String, description: 'firstName' }) // this will give the schema to the swagger api
  firstName: string;

  @IsString()
  @ApiProperty({ type: String, description: 'lastName' }) // this will give the schema to the swagger api
  lastName: string;

  @IsString()
  @ApiProperty({ type: String, description: 'phone' }) // this will give the schema to the swagger api
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ type: String, description: 'Password' }) // this will give the schema to the swagger api
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords is weak.Password must contain upper case letter, lower case letter and number or special character',
  })
  password: string;
}

export class AuthCredentialSignInDto {
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' }) // this will give the schema to the swagger api
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ type: String, description: 'Password' }) // this will give the schema to the swagger api
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords is weak.Password must contain upper case letter, lower case letter and number or special character',
  })
  password: string;
}
