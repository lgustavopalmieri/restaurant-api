import { Category } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  name: string;
  description: string;
  email: string;
  phoneNo: number;
  address: string;
  category: Category;
  images?: object[];
}
