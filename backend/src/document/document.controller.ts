/*eslint-disable*/
import { 
    Body, 
    Controller, 
    FileTypeValidator, 
    ParseFilePipe, 
    Post, 
    Request, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CreateDocumentDto } from './dto/createDocumentDto.dto';
import { DocumentService } from './document.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService){}

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    create(
        @UploadedFile(
            new ParseFilePipe({
            validators: [
                new FileTypeValidator({
                fileType: 'application/pdf',
                }),
            ],
            }),
        ) file: Express.Multer.File,
        // @Body() dto: CreateDocumentDto,
        @Body('filename') filename: string,
        @Request() req: any
    ) {
        console.log('FILE:', file?.originalname);
        console.log('FILENAME:', filename);
        console.log('USER:', req.user);
        
        return this.documentService.createDocument(
            file,
            filename,
            req.user.sub
        );
    }
}
