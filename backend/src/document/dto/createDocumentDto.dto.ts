/*eslint-disable*/
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
    @IsString()
    userId?: string;

    @ApiProperty({ example: 'Great Document about Science.pdf' })
    @IsString()
    filename?: string;

    @ApiProperty({ example:  'GDS - Revised (1).pdf'})
    @IsString()
    originalName?: string;
}