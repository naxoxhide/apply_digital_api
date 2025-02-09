import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
export declare class ProductsService {
    private productModel;
    private readonly logger;
    constructor(productModel: Model<Product>);
    fetchProductsFromContentful(): Promise<void>;
    getProducts(filters: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, Product> & Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
    }>;
    softDeleteProduct(productId: string): Promise<void>;
}
