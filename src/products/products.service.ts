import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  @Cron('0 * * * *')
  async fetchProductsFromContentful() {
    try {
      this.logger.log('Fetching products from Contentful API...');
      const { data } = await axios.get(
        `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?content_type=${process.env.CONTENTFUL_CONTENT_TYPE}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
          },
        },
      );

      const products = data.items.map((item) => ({
        contentfulId: item.sys.id,
        name: item.fields.name,
        category: item.fields.category,
        price: item.fields.price,
      }));

      for (const product of products) {
        await this.productModel.updateOne(
          { contentfulId: product.contentfulId },
          { $set: product },
          { upsert: true },
        );
      }

      this.logger.log(`Fetched and stored ${products.length} products.`);
    } catch (error) {
      this.logger.error('Error fetching products', error);
    }
  }

  async getProducts(filters: any) {
    const { page, limit, name, category, minPrice, maxPrice } = filters;

    const query: any = {};
    if (name) query.name = new RegExp(name, 'i');
    if (category) query.category = category;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    const total = await this.productModel.countDocuments(query);
    const data = await this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    return { data, total };
  }

  async softDeleteProduct(productId: string): Promise<void> {
    await this.productModel.updateOne(
      { contentfulId: productId },
      { $set: { deletedAt: new Date() } },
    );
  }
}
