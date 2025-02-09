import {
  Controller,
  Get,
  Query,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products' })
  @ApiResponse({ status: 200, description: 'Products found' })
  @ApiResponse({ status: 404, description: 'Products not found' })
  async getProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ): Promise<{ data: Product[]; total: number }> {
    return this.productsService.getProducts({
      page,
      limit,
      name,
      category,
      minPrice,
      maxPrice,
    });
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(204)
  async softDelete(@Param('id') productId: string): Promise<void> {
    await this.productsService.softDeleteProduct(productId);
  }
}
