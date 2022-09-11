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
  ForbiddenException,
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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
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
  @UseGuards(AuthGuard())
  async findByIdAndUpdate(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantsService.findById(id);

    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You cannot update this resturant');
    }

    return this.restaurantsService.findByIdAndUpdate(id, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async findByIdAndDelete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const restaurantExists = await this.restaurantsService.findById(id);

    if (restaurantExists.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You cannot delete this resturant');
    }

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
  @UseGuards(AuthGuard())
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
