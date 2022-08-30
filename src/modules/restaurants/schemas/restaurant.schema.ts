import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

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

@Schema()
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
  images?: object[];

  @Prop({ type: Object })
  test: SomePayload;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
