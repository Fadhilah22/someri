/*eslint-disable*/
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';

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
        return this.summaryService.createSummary(dto);
    }

    @Post()
    async getSummaries(
        @Body('documentIds') documentIds: string[],
    ) {
        return this.summaryService.getSummaries(documentIds);
    }

    @Delete(':id/delete')
    async deleteSummary(
        @Param('id') id: string,
    ) {
        return this.summaryService.deleteSummary(id);
    }

    @Get(':id/:docname/pdf')
    async downloadPdf(
        @Param('id') id: string,
        @Param('docname') docname: string,
        @Query('theme') theme: 'light' | 'dark' = 'light',
        @Res() res: Response,
    ) {
        const summary = await this.summaryService.getSummaryById(id);

        const pdf = await this.summaryService.generateSummaryPdf({
            documentName: docname, // swap for document name if you join it
            createdAt: summary.createdAt.toISOString(),
            content: summary.content,
            theme,
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${summary.documentId}.pdf"`,
            'Content-Length': pdf.length,
        });

        res.end(pdf);
    }
}