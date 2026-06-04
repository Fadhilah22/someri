/*eslint-disable*/
import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { PdfModule } from '../pdf/pdf.module';
import { LlmModule } from '../llm/llm.module';
import { PrismaService } from '../prisma.service';

@Module({
    imports: [PdfModule, LlmModule],
    controllers: [SummaryController],
    providers: [SummaryService, PrismaService],
})
export class SummaryModule {}