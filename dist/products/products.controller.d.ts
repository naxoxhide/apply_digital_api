import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProducts(page?: number, limit?: number, name?: string, category?: string, minPrice?: number, maxPrice?: number): Promise<{
        data: Product[];
        total: number;
    }>;
    softDelete(productId: string): Promise<void>;
}
