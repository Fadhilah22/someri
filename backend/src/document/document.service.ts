/*eslint-disable*/
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PdfService } from '../pdf/pdf.service';
// import { CreateDocumentDto } from './dto/createDocumentDto.dto';

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService, private readonly pdfService: PdfService) {}

    // createDocument
    async createDocument(
        file: Express.Multer.File,
        filename: string,
        userId: string,
    ) {
        try {
                const parsed =
                    await this.pdfService.extractText(file);
        
                return this.prisma.document.create({
                    data: {
                        filename:
                            filename === ''
                                ? file.originalname
                                : filename,
                        originalName: file.originalname,
                        extractedText: parsed,
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });
            } catch (error) {
                console.error(error);
            
                throw error;
        }
    }
}