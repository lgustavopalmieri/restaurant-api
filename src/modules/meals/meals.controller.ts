import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './schemas/meal.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorators';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealsService.create(createMealDto, user);
  }

  @Get()
  async findAllMeals() {
    return this.mealsService.findAll();
  }

  @Get('restaurant/:id')
  async getMealsByRestaurant(@Param('id') id: string): Promise<Meal[]> {
    return this.mealsService.findByRestaurant(id);
  }

  @Get(':id')
  async getMealById(@Param('id') id: string): Promise<Meal> {
    return this.mealsService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateMeal(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    const meal = await this.mealsService.findById(id);

    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You cannot update this meal');
    }
    return this.mealsService.updateMealById(id, updateMealDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const meal = await this.mealsService.findById(id);
    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You cannot update this meal');
    }
    return this.mealsService.deleteById(id);
  }
}
