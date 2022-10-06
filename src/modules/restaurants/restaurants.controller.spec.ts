import { ForbiddenException } from '@nestjs/common';
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
  user: '631f18b3a73163f51faad89e',
  createdAt: '2022-09-12T11:32:03.383Z',
  updatedAt: '2022-09-12T11:32:03.383Z',
};

const mockUser = {
  _id: '631f18b3a73163f51faad89e',
  name: 'UserNone',
  email: 'mail23@mail.com',
  role: UserRoles.USER,
};

const mockRestaurantService = {
  findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
  create: jest.fn(),
  findById: jest.fn().mockResolvedValueOnce(mockRestaurant),
  findByIdAndUpdate: jest.fn().mockResolvedValueOnce(mockRestaurant),
  deleteImages: jest.fn().mockResolvedValueOnce(true),
  findByIdAndDelete: jest.fn().mockResolvedValueOnce({ deleted: true }),
};

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

  describe('getAllRestaurants', () => {
    it('should get all restaurants', async () => {
      const result = await controller.getAllRestaurants({
        keyword: 'restaurant',
      });
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockRestaurant]);
    });
  });

  describe('createRestaurant', () => {
    it('should create a new restaurant', async () => {
      const newRestaurant = {
        name: 'Testing Meals',
        description: 'Amazing first restaurant',
        email: '2das2mail@mail.com',
        phoneNo: 999783661,
        address: 'Avenida Rudge Ramos, São Bernardo do Campo, BRAZIL',
        category: 'Cafe',
      };

      mockRestaurantService.create = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const result = await controller.createRestaurant(
        newRestaurant as any,
        mockUser as any,
      );

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('getRestaurantById', () => {
    it('should get restaurant by id', async () => {
      const result = await controller.findById(mockRestaurant._id);
      expect(service.findById).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update an restaurant by ID', async () => {
      const restaurant = { ...mockRestaurant, name: 'Updated name' };
      const updateRestaurant = { name: 'Updated name' };

      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValueOnce(restaurant);

      const result = await controller.findByIdAndUpdate(
        restaurant._id,
        updateRestaurant as any,
        mockUser as any,
      );

      expect(service.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
      expect(result.name).toEqual(restaurant.name);
    });

    it('Should throw forbidden error', async () => {
      const restaurant = { ...mockRestaurant, name: 'Updated name' };
      const updateRestaurant = { name: 'Updated name' };

      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(restaurant);

      const user = {
        ...mockUser,
        _id: '631f18b3a73163f51faad893',
      };

      await expect(
        controller.findByIdAndUpdate(
          restaurant._id,
          updateRestaurant as any,
          user as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete restaurant by ID', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      const result = await controller.findByIdAndDelete(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });

    it('should not delete restaurant by ID because images are not deleted', async () => {
      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(mockRestaurant);

      mockRestaurantService.deleteImages = jest
        .fn()
        .mockResolvedValueOnce(false);

      const result = await controller.findByIdAndDelete(
        mockRestaurant._id,
        mockUser as any,
      );

      expect(service.findByIdAndDelete).toHaveBeenCalled();
      expect(result).toEqual({ deleted: false });
    });

    it('Should throw forbidden error', async () => {
      const restaurant = { ...mockRestaurant, name: 'Updated name' };
      const updateRestaurant = { name: 'Updated name' };

      mockRestaurantService.findById = jest
        .fn()
        .mockResolvedValueOnce(restaurant);

      const user = {
        ...mockUser,
        _id: '631f18b3a73163f51faad893',
      };

      await expect(
        controller.findByIdAndDelete(mockRestaurant._id, user as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
