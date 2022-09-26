import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserRoles } from '../auth/schemas/user.schema';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

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

const mockUser = {
  _id: '631f18b3a73163f51faad89e',
  name: 'UserNone',
  email: 'mail23@mail.com',
  role: UserRoles.USER,
};

const mockRestaurantService = {};

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
