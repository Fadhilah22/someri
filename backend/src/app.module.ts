import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LlmModule } from './llm/llm.module';
import { SummaryModule } from './summary/summary.module';
// import { PdfService } from './pdf/pdf.service';
import { PdfModule } from './pdf/pdf.module';
import { DocumentModule } from './document/document.module';
// import { DocumentService } from './document/document.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    LlmModule,
    SummaryModule,
    PdfModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
