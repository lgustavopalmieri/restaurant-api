import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
import { Meal } from 'src/modules/meals/schemas/meal.schema';

@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ index: '2dsphere' })
  coordinates: number[];

  formattedAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export enum Category {
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}

export interface SomePayload {
  test1: string;
  test2: {
    test3: string;
  };
}

@Schema({ timestamps: true })
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phoneNo: number;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  // eslint-disable-next-line @typescript-eslint/ban-types
  images?: Object[];

  @Prop({ type: Object, ref: 'Location' })
  location?: Location;

  @Prop({ type: Object })
  test: SomePayload;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }])
  menu?: Meal[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
