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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../products/schemas/product.schema");
let ReportsService = class ReportsService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async getDeletedPercentage() {
        const total = await this.productModel.countDocuments();
        const deleted = await this.productModel.countDocuments({
            deletedAt: { $ne: null },
        });
        const percentage = total > 0 ? (deleted / total) * 100 : 0;
        return `${percentage.toFixed(3)}%`;
    }
    async getNonDeletedPercentage(params) {
        const query = { deletedAt: null };
        if (params.hasPrice !== undefined) {
            query.price = params.hasPrice ? { $exists: true } : { $exists: false };
        }
        if (params.startDate || params.endDate) {
            query.createdAt = {};
            if (params.startDate)
                query.createdAt.$gte = params.startDate;
            if (params.endDate)
                query.createdAt.$lte = params.endDate;
        }
        const total = await this.productModel.countDocuments();
        const nonDeleted = await this.productModel.countDocuments(query);
        const percentage = total > 0 ? (nonDeleted / total) * 100 : 0;
        return `${percentage.toFixed(3)}%`;
    }
    async getCustomReport() {
        const report = await this.productModel.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        return report;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map