import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category, SomePayload } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Please enter a correct email adress' })
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phoneNo: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category' })
  category: Category;

  @IsOptional()
  @IsArray()
  images?: object[];

  @IsObject()
  test: {
    test1: string;
    test2: {
      test3: string;
    };
  };
}
