import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { UpdateFoodDto } from './dto/update-food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
}
