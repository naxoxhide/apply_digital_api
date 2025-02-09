"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("axios");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(productModel) {
        this.productModel = productModel;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    async fetchProductsFromContentful() {
        try {
            this.logger.log('Fetching products from Contentful API...');
            const { data } = await axios_1.default.get(`https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?content_type=${process.env.CONTENTFUL_CONTENT_TYPE}`, {
                headers: {
                    Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
                },
            });
            const products = data.items.map((item) => ({
                contentfulId: item.sys.id,
                name: item.fields.name,
                category: item.fields.category,
                price: item.fields.price,
            }));
            for (const product of products) {
                await this.productModel.updateOne({ contentfulId: product.contentfulId }, { $set: product }, { upsert: true });
            }
            this.logger.log(`Fetched and stored ${products.length} products.`);
        }
        catch (error) {
            this.logger.error('Error fetching products', error);
        }
    }
    async getProducts(filters) {
        const { page, limit, name, category, minPrice, maxPrice } = filters;
        const query = {};
        if (name)
            query.name = new RegExp(name, 'i');
        if (category)
            query.category = category;
        if (minPrice)
            query.price = { $gte: minPrice };
        if (maxPrice)
            query.price = Object.assign(Object.assign({}, query.price), { $lte: maxPrice });
        const total = await this.productModel.countDocuments(query);
        const data = await this.productModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        return { data, total };
    }
    async softDeleteProduct(productId) {
        await this.productModel.updateOne({ contentfulId: productId }, { $set: { deletedAt: new Date() } });
    }
};
exports.ProductsService = ProductsService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsService.prototype, "fetchProductsFromContentful", null);
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map