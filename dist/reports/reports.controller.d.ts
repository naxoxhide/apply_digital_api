import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDeletedPercentage(): Promise<string>;
    getNonDeletedPercentage(hasPrice: string, startDate: string, endDate: string): Promise<string>;
    getCustomReport(): Promise<any[]>;
}
