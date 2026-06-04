/*eslint-disable*/
import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class PdfService {
    async extractText(
        file: Express.Multer.File,
    ): Promise<string> {
        const parser = new PDFParse({
            data: file.buffer,
        });
    
        const result = await parser.getText();
    
        return result.text.trim();
    }
}