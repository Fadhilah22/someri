/*eslint-disable*/
import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSummaryDto {
    @IsString()
    DocumentId?: string;

    @IsEnum(['systematic', 'bite-size', 'chronological'])
    style?: string;

    @IsEnum(['short', 'medium', 'long'])
    length?: string;

    @IsString()
    language?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    startPage?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    endPage?: number;
}

export class SummaryResponseDto {
    markdown?: string;
}