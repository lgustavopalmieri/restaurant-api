import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

const mockRestaurant = {
  _id: '631f18b3a73163f51faad89e',
  name: 'Testing Meals',
  description: 'Amazing first restaurant',
  email: '2das2mail@mail.com',
  phoneNo: 999783661,
  address: 'Avenida Rudge Ramos, São Bernardo do Campo, BRAZIL',
  category: 'Cafe',
  images: [],
  location: {
    type: 'Point',
    coordinates: [-46.57784, -23.64899],
    formattedAddress:
      'Avenida Rudge Ramos, São Bernardo do Campo, São Paulo 09624, 09635, 09636, 09637, 09638, 09639, 09641, 09895, BR',
    city: 'São Bernardo do Campo',
    state: 'São Paulo',
    zipcode: '09624, 09635, 09636, 09637, 09638, 09639, 09641, 09895',
    country: 'BR',
  },
  test: {
    test1: 'string;',
    test2: {
      test3: 'string;',
    },
  },
  menu: [],
  user: '631e57054437cb446886b1eb',
  createdAt: '2022-09-12T11:32:03.383Z',
  updatedAt: '2022-09-12T11:32:03.383Z',
};

const mockRestaurantService = {
  find: jest.fn(),
};

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let model: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should get all restaurants', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockRestaurant]),
            }),
          } as any),
      );

      const restaurants = await service.findAll({ keyword: 'restaurant' });

      expect(restaurants).toEqual([mockRestaurant]);
    });
  });
});
