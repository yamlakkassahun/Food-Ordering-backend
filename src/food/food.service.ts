import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from 'src/models/food.schema';
import { Vendor, VendorDocument } from 'src/models/vendor.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
  ) {}

  async addFood(
    vendor: Vendor,
    createFoodDto: CreateFoodDto,
    images: Array<Express.Multer.File>,
  ): Promise<Food> {
    const { name, description, category, price } = createFoodDto;
    const image = images.map((file: Express.Multer.File) => file.filename);

    try {
      const existingVendor = await this.vendorModel.findOne({
        email: vendor.email,
      });

      if (existingVendor != null) {
        const food = this.foodModel.create({
          vendorId: existingVendor._id,
          name: name,
          category: category,
          description: description,
          price: price,
          rating: 1,
          images: image,
        });

        existingVendor.foods.push(await food);
        await existingVendor.save();
        return food;
      }
      throw new HttpException('Sorry Some Error Occur', 404);
    } catch (error) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  async findAllFoods(vendor: Vendor): Promise<Food[]> {
    const { email } = vendor;
    try {
      const existingVendor = await this.vendorModel.findOne({ email });
      if (existingVendor != null) {
        const foods: Food[] = existingVendor.foods;
        return foods;
      }
    } catch (e) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  async findOneFood(vendor: Vendor, id: string): Promise<Food> {
    const { email } = vendor;
    try {
      const existingVendor = await this.vendorModel.findOne({ email });
      if (existingVendor != null) {
        const result = existingVendor.foods.find(
          async (food) => food.toString() === id,
        );
        if (result !== null) {
          const food = await this.foodModel.findOne({ id });
          return food;
        }

        throw new HttpException('Sorry no food Found!', 404);
      }
    } catch (e) {
      throw new HttpException('Sorry no vendor Found!', 404);
    }
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
