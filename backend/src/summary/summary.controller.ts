/*eslint-disable*/
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
} from '@nestjs/common';

import { SummaryService } from './summary.service';
import { CreateSummaryDto } from './dto/createsummary.dto';


@Controller('summary')
export class SummaryController {
    constructor(
        private readonly summaryService: SummaryService,
    ) {}

    @Post()
    async createSummary(
        @Body() dto: CreateSummaryDto,
    ) {
        console.log(
            dto.DocumentId,
            dto.style,
            dto.length,
            dto.language,
            dto.startPage,
            dto.endPage,
        )
        return this.summaryService.createSummary(
            dto,
        );
    }

    @Post()
    async getSummaries(
        @Body('documentIds') documentIds: string[],
    ) {
        return this.summaryService.getSummaries(documentIds);
    }

    @Delete(':id/delete')
    async deleteSummary(
        @Param('id') id:string,
    ){
        return this.summaryService.deleteSummary(
            id
        );
    }
}