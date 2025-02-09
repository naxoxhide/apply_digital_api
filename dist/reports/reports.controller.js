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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const auth_guard_1 = require("../auth/guard/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getDeletedPercentage() {
        return this.reportsService.getDeletedPercentage();
    }
    async getNonDeletedPercentage(hasPrice, startDate, endDate) {
        return this.reportsService.getNonDeletedPercentage({
            hasPrice: hasPrice === 'true',
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async getCustomReport() {
        return this.reportsService.getCustomReport();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('deleted-percentage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'Authorization', description: 'Bearer token' }),
    (0, swagger_1.ApiOperation)({ summary: 'Get deleted percentage of products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted percentage found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deleted percentage not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDeletedPercentage", null);
__decorate([
    (0, common_1.Get)('non-deleted-percentage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'Authorization', description: 'Bearer token' }),
    (0, swagger_1.ApiOperation)({ summary: 'Get non-deleted percentage of products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Non-deleted percentage found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Non-deleted percentage not found' }),
    __param(0, (0, common_1.Query)('hasPrice')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getNonDeletedPercentage", null);
__decorate([
    (0, common_1.Get)('custom-report'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'Authorization', description: 'Bearer token' }),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom report found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Custom report not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCustomReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map