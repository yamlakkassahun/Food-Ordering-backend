import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFoodDto {
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
  @ApiProperty({ type: String, description: 'price' })
  price: string;
}
