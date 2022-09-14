import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';
import APIFeatures from '../../utils/api-features.util';
import { User } from '../auth/schemas/user.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    //just works with name param
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);

    return restaurants;
  }

  async create(
    restaurant: CreateRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    const location = await APIFeatures.getRestaurantLocation(
      restaurant.address,
    );
    const data = Object.assign(restaurant, { user: user._id, location });
    const newRestaurant = await this.restaurantModel.create(data);
    return newRestaurant;
  }

  async findById(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException(
        'Wrong mongoose ID Error. Enter correct ID.',
      );
    }
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }
    return restaurant;
  }

  async findByIdAndUpdate(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(
      id,
      updateRestaurantDto,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async findByIdAndDelete(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndDelete(id);
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
    const images = await APIFeatures.upload(files);

    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        // eslint-disable-next-line @typescript-eslint/ban-types
        images: images as Object[],
      },
      {
        new: true,
        runValidators: true,
      },
    );
    console.log(files);
    return restaurant;
  }

  async deleteImages(images) {
    if (images.length === 0) return true;
    const res = await APIFeatures.deleteImages(images);
    return res;
  }
}
