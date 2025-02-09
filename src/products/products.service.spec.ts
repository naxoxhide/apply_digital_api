import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import axios from 'axios';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: any;

  const mockProductModel = {
    updateOne: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    process.env.CONTENTFUL_SPACE_ID = 'dummySpaceId';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get(getModelToken(Product.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProductsFromContentful', () => {
    it('should fetch products from Contentful and update them in the DB', async () => {
      const fakeData = {
        items: [
          {
            sys: { id: 'prod1' },
            fields: { name: 'Product 1', category: 'Cat1', price: 100 },
          },
          {
            sys: { id: 'prod2' },
            fields: { name: 'Product 2', category: 'Cat2', price: 200 },
          },
        ],
      };

      jest.spyOn(axios, 'get').mockResolvedValue({ data: fakeData });
      productModel.updateOne.mockResolvedValue({});

      await service.fetchProductsFromContentful();

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('dummySpaceId'),
        expect.any(Object)
      );

      expect(productModel.updateOne).toHaveBeenCalledTimes(fakeData.items.length);
      expect(productModel.updateOne).toHaveBeenCalledWith(
        { contentfulId: 'prod1' },
        { $set: { contentfulId: 'prod1', name: 'Product 1', category: 'Cat1', price: 100 } },
        { upsert: true }
      );
      expect(productModel.updateOne).toHaveBeenCalledWith(
        { contentfulId: 'prod2' },
        { $set: { contentfulId: 'prod2', name: 'Product 2', category: 'Cat2', price: 200 } },
        { upsert: true }
      );
    });

    it('should log error when fetching products fails', async () => {
      const error = new Error('Network error');
      jest.spyOn(axios, 'get').mockRejectedValue(error);
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      await service.fetchProductsFromContentful();
      expect(loggerErrorSpy).toHaveBeenCalledWith('Error fetching products', error);
    });
  });

  describe('getProducts', () => {
    it('should return paginated products based on filters', async () => {
      const filters = {
        page: 2,
        limit: 5,
        name: 'Test',
        category: 'Cat1',
        minPrice: 50,
        maxPrice: 150,
      };

      const expectedQuery = {
        name: new RegExp('Test', 'i'),
        category: 'Cat1',
        price: { $gte: 50, $lte: 150 },
      };

      productModel.countDocuments.mockResolvedValue(10);

      const fakeProducts = [{ name: 'Product X', category: 'Cat1', price: 100 }];
      const skipMock = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(fakeProducts),
      });
      productModel.find.mockReturnValue({ skip: skipMock });

      const result = await service.getProducts(filters);
      expect(productModel.countDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(productModel.find).toHaveBeenCalledWith(expectedQuery);
      expect(skipMock).toHaveBeenCalledWith((filters.page - 1) * filters.limit);
      expect(result).toEqual({ data: fakeProducts, total: 10 });
    });
  });

  describe('softDeleteProduct', () => {
    it('should update the product with deletedAt field', async () => {
      productModel.updateOne.mockResolvedValue({});
      const productId = 'prod1';
      await service.softDeleteProduct(productId);

      expect(productModel.updateOne).toHaveBeenCalledWith(
        { contentfulId: productId },
        { $set: { deletedAt: expect.any(Date) } }
      );
    });
  });
});
