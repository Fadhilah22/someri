/* eslint-disable */
import {
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IntegrationDto {
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    server_label?: string;

    @IsOptional()
    @IsString()
    server_url?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allowed_tools?: string[];
}

export class MessageInputDto {
    @IsString()
    @IsIn(['message'])
    type: 'message';

    @IsString()
    content: string;
}

export class ImageInputDto {
    @IsString()
    @IsIn(['image'])
    type?: 'image';
    
    @IsString()
    data_url?: string;
}

export class ChatRequestDto {
    @IsString()
    model?: string;

    /**
     * LM Studio accepts:
     * - string
     * - array of message/image objects
     *
     * If you want strict validation,
     * create separate DTOs and use discriminators.
     */
    input?: string | (MessageInputDto | ImageInputDto)[];

    @IsOptional()
    @IsString()
    system_prompt?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => IntegrationDto)
    @IsArray()
    integrations?: IntegrationDto[];

    @IsOptional()
    @IsInt()
    context_length?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    temperature?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    top_p?: number;

    @IsOptional()
    @IsInt()
    top_k?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    min_p?: number;

    @IsOptional()
    @IsNumber()
    repeat_penalty?: number;

    @IsOptional()
    @IsInt()
    max_output_tokens?: number;

    @IsOptional()
    @IsIn(['off', 'low', 'medium', 'high', 'on'])
    reasoning?: 'off' | 'low' | 'medium' | 'high' | 'on';

    @IsOptional()
    @IsBoolean()
    stream?: boolean;

    @IsOptional()
    @IsBoolean()
    store?: boolean;

    @IsOptional()
    @IsString()
    previous_response_id?: string;
}

export class LmStudioOutputDto {
  type?: string;
  content?: string;
}

export class LmStudioStatsDto {
  input_tokens: number;
  total_output_tokens: number;
  reasoning_output_tokens: number;
  tokens_per_second: number;
  time_to_first_token_seconds: number;
}

export interface LmStudioChatResponse {
    model_instance_id: string;
    output: {
        type: string;
        content: string;
    }[];
    stats: {
        input_tokens: number;
        total_output_tokens: number;
        reasoning_output_tokens: number;
        tokens_per_second: number;
        time_to_first_token_seconds: number;
    };
    response_id: string;
}

export class ChatResponseDto {
    content?: string;

    inputTokens?: number;
    outputTokens?: number;

    model?: string;
    responseId?: string;
}