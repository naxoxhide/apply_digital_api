import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  @ApiBearerAuth()
  @ApiHeader({  name: 'Authorization', description: 'Bearer token' })
  @ApiOperation({ summary: 'Get deleted percentage of products' })
  @ApiResponse({ status: 200, description: 'Deleted percentage found' })
  @ApiResponse({ status: 404, description: 'Deleted percentage not found' })
  async getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @Get('non-deleted-percentage')
  @ApiBearerAuth()
  @ApiHeader({  name: 'Authorization', description: 'Bearer token' })
  @ApiOperation({ summary: 'Get non-deleted percentage of products' })
  @ApiResponse({ status: 200, description: 'Non-deleted percentage found' })
  @ApiResponse({ status: 404, description: 'Non-deleted percentage not found' })
  async getNonDeletedPercentage(
    @Query('hasPrice') hasPrice: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getNonDeletedPercentage({
      hasPrice: hasPrice === 'true',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('custom-report')
  @ApiBearerAuth()
  @ApiHeader({  name: 'Authorization', description: 'Bearer token' })
  @ApiOperation({ summary: 'Get custom report' })
  @ApiResponse({ status: 200, description: 'Custom report found' })
  @ApiResponse({ status: 404, description: 'Custom report not found' })
  async getCustomReport() {
    return this.reportsService.getCustomReport();
  }
}
