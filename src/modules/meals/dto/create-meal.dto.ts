import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/modules/auth/schemas/user.schema';
import { Category } from '../schemas/meal.schema';

export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category for this meal.' })
  readonly category: Category;

  @IsString()
  @IsNotEmpty()
  readonly restaurant: string;

  @IsNotEmpty({ message: 'You cannot provide a user ID.' })
  readonly user: User;
}
