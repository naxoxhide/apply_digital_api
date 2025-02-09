import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../products/schemas/product.schema';

describe('ReportsService', () => {
  let service: ReportsService;
  let productModel: any;

  const mockProductModel = {
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    productModel = module.get(getModelToken(Product.name));
    jest.clearAllMocks();
  });

  describe('getDeletedPercentage', () => {
    it('should return correct deleted percentage when total > 0', async () => {
      productModel.countDocuments
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(25);

      const result = await service.getDeletedPercentage();
      expect(result).toBe('25.000%');
      expect(productModel.countDocuments).toHaveBeenNthCalledWith(2, { deletedAt: { $ne: null } });
    });

    it('should return 0.000% when total is 0', async () => {
      productModel.countDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getDeletedPercentage();
      expect(result).toBe('0.000%');
    });
  });

  describe('getNonDeletedPercentage', () => {
    it('should return correct non-deleted percentage with no additional filters', async () => {
      productModel.countDocuments
        .mockResolvedValueOnce(200)
        .mockResolvedValueOnce(150);

      const result = await service.getNonDeletedPercentage({});
      expect(result).toBe('75.000%');
      expect(productModel.countDocuments).toHaveBeenNthCalledWith(2, { deletedAt: null });
    });

    it('should include price filter when hasPrice is true', async () => {
      productModel.countDocuments
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(80);

      const result = await service.getNonDeletedPercentage({ hasPrice: true });
      expect(result).toBe('80.000%');
      expect(productModel.countDocuments).toHaveBeenNthCalledWith(2, { deletedAt: null, price: { $exists: true } });
    });

    it('should include date filters when provided', async () => {
      const startDate = new Date('2022-01-01');
      const endDate = new Date('2022-02-01');

      productModel.countDocuments
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(30);

      const result = await service.getNonDeletedPercentage({ startDate, endDate });
      expect(result).toBe('60.000%');
      expect(productModel.countDocuments).toHaveBeenNthCalledWith(2, {
        deletedAt: null,
        createdAt: { $gte: startDate, $lte: endDate },
      });
    });
  });

  describe('getCustomReport', () => {
    it('should return the custom report from aggregation', async () => {
      const fakeReport = [
        { _id: 'Cat1', count: 5 },
        { _id: 'Cat2', count: 3 },
      ];
      productModel.aggregate.mockResolvedValue(fakeReport);

      const result = await service.getCustomReport();
      expect(result).toEqual(fakeReport);
      expect(productModel.aggregate).toHaveBeenCalledWith([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
    });
  });
});
