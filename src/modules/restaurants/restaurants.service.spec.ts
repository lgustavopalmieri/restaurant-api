import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import APIFeatures from '../../utils/api-features.util';
import { UserRoles } from '../auth/schemas/user.schema';
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

const mockUser = {
  _id: '631f18b3a73163f51faad89e',
  name: 'UserNone',
  email: 'mail23@mail.com',
  role: UserRoles.USER,
};

const mockRestaurantService = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
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

  describe('create', () => {
    const newRestaurant = {
      name: 'Testing Meals',
      description: 'Amazing first restaurant',
      email: '2das2mail@mail.com',
      phoneNo: 999783661,
      address: 'Avenida Rudge Ramos, São Bernardo do Campo, BRAZIL',
      category: 'Cafe',
    };
    it('should create a new restaurant', async () => {
      jest
        .spyOn(APIFeatures, 'getRestaurantLocation')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant.location));

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockRestaurant));

      const result = await service.create(
        newRestaurant as any,
        mockUser as any,
      );

      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('findById', () => {
    it('should get a restaurant by Id', async () => {
      jest
        .spyOn(model, 'findById')
        .mockResolvedValueOnce(mockRestaurant as any);

      const result = await service.findById(mockRestaurant._id);
      expect(result).toEqual(mockRestaurant);
    });

    it('should throw wrong mongoose id error', async () => {
      await expect(service.findById('wrongId')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw restaurant not found error', async () => {
      const mockError = new NotFoundException('Restaurant not found.');
      jest.spyOn(model, 'findById').mockRejectedValue(mockError);

      await expect(service.findById(mockRestaurant._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update the restaurant', async () => {
      const restaurant = { ...mockRestaurant, name: 'Updated name' };
      const updateRestaurant = {
        name: 'Updated name',
      };

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(restaurant as any);

      const updatedRestaurant = await service.findByIdAndUpdate(
        restaurant._id,
        updateRestaurant as any,
      );

      expect(updatedRestaurant.name).toEqual(updateRestaurant.name);
    });
  });

  describe('findByIdAndDelete', () => {
    it('should delete by id and delete restaurant', async () => {
      jest
        .spyOn(model, 'findByIdAndDelete')
        .mockResolvedValueOnce(mockRestaurant as any);

      const result = await service.findByIdAndDelete(mockRestaurant._id);

      expect(result).toEqual(mockRestaurant);
    });
  });

  describe('uploadImages', () => {
    it(' should upload images on AWS s3 Bucket', async () => {
      const mockImages = [
        {
          ETag: '"fe7a8b7e500770edeef853c49f72aed6"',
          Location:
            'https://restaurant-api-lgustavopalmieri.s3.sa-east-1.amazonaws.com/restaurants/ass_1661951429168.png',
          key: 'restaurants/ass_1661951429168.png',
          Key: 'restaurants/ass_1661951429168.png',
          Bucket: 'restaurant-api-lgustavopalmieri',
        },
      ];
      const updatedRestaurant = { ...mockRestaurant, images: mockImages };

      jest.spyOn(APIFeatures, 'upload').mockResolvedValueOnce(mockImages);

      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(updatedRestaurant as any);

      const files = [
        {
          fieldname: 'files',
          originalname: 'Tutorial(9)_0.png',
          encoding: '7bit',
          mimetype: 'image/png',
          buffer:
            '<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 05 00 00 00 03 00 08 02 00 00 00 f4 56 5d 9a 00 01 00 00 49 44 41 54 78 9c 74 bd ed 9a 1b 39 ae ... 1361388 more bytes>',
          size: 1361438,
        },
      ];

      const result = await service.uploadImages(
        mockRestaurant._id,
        files as any,
      );

      expect(result).toEqual(updatedRestaurant);
    });
  });

  describe('deleteImages', () => {
    it('should delete images from AWS s3 bucket', async () => {
      const mockImages = [
        {
          ETag: '"fe7a8b7e500770edeef853c49f72aed6"',
          Location:
            'https://restaurant-api-lgustavopalmieri.s3.sa-east-1.amazonaws.com/restaurants/ass_1661951429168.png',
          key: 'restaurants/ass_1661951429168.png',
          Key: 'restaurants/ass_1661951429168.png',
          Bucket: 'restaurant-api-lgustavopalmieri',
        },
      ];

      jest.spyOn(APIFeatures, 'deleteImages').mockResolvedValueOnce(true);

      const result = await service.deleteImages(mockImages);

      expect(result).toBe(true);
    });
  });
});
