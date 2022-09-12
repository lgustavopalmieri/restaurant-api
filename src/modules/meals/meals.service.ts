import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './schemas/meal.schema';

@Injectable()
export class MealsService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}
  async create(createMealDto: CreateMealDto, user: User): Promise<Meal> {
    const data = Object.assign(createMealDto, { user: user._id });

    const restaurant = await this.restaurantModel.findById(
      createMealDto.restaurant,
    );

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }

    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not add meal to this restaurant.');
    }

    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated._id as any);

    await restaurant.save();

    return mealCreated;
  }

  async findAll(): Promise<Meal[]> {
    const meals = await this.mealModel.find();
    return meals;
  }

  async findByRestaurant(id: string): Promise<Meal[]> {
    const meals = await this.mealModel.find({
      restaurant: id,
    });
    return meals;
  }

  async findById(id: string): Promise<Meal> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Wrong mongoose ID error');
    }
    const meal = await this.mealModel.findById(id);

    if (!meal) {
      throw new NotFoundException('Meal not found.');
    }
    return meal;
  }

  async updateMealById(
    id: string,
    updateMealDto: UpdateMealDto,
  ): Promise<Meal> {
    return await this.mealModel.findByIdAndUpdate(id, updateMealDto, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const res = await this.mealModel.findByIdAndDelete(id);

    if (res) {
      const restaurant = await this.restaurantModel.findById(res.restaurant);
      const findOnMenu = restaurant.menu.indexOf(id as any);
      if (findOnMenu !== -1) {
        restaurant.menu.splice(findOnMenu, 1);
        await restaurant.save();
      }

      return { deleted: true };
    }

    return { deleted: false };
  }
}
