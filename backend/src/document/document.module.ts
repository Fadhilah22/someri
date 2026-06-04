/*eslint-disable*/
import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { PdfModule } from '../pdf/pdf.module';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PdfModule, AuthModule],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    PrismaService,
  ],
})
export class DocumentModule {}
