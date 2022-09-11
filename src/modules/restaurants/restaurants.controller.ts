import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorators';
import { User } from '../auth/schemas/user.schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createRestaurant(
    @Body() restaurant: CreateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Patch(':id')
  async findByIdAndUpdate(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    await this.restaurantsService.findById(id);
    return this.restaurantsService.findByIdAndUpdate(id, updateRestaurantDto);
  }

  @Delete(':id')
  async findByIdAndDelete(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean }> {
    const restaurantExists = await this.restaurantsService.findById(id);

    const isDeleted = await this.restaurantsService.deleteImages(
      restaurantExists.images,
    );

    if (isDeleted) {
      this.restaurantsService.findByIdAndDelete(id);
      return {
        deleted: true,
      };
    } else {
      return {
        deleted: false,
      };
    }
  }

  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantsService.findById(id);
    const res = await this.restaurantsService.uploadImages(id, files);
    return res;
  }
}
