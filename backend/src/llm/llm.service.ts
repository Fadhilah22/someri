/*eslint-disable*/
import {
    Injectable,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ChatRequestDto, ChatResponseDto, LmStudioChatResponse } from './dto/chat.dto';

@Injectable()
export class LlmService {
    async chat(dto: ChatRequestDto): Promise<ChatResponseDto> {
        console.log('[LLM] Request started');
        console.log('[LLM] Payload:', dto);

        try {
            console.log('[LLM] Sending request to LM Studio...');

            const response = await fetch(
                'http://172.18.240.1:1234/api/v1/chat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer sk-lm-0YHOX1A8:W5T5tAgOnnwrRl7rfWTN'
                    },
                    body: JSON.stringify(dto),
                },
            );

            console.log('[LLM] Response received');
            console.log('[LLM] Status:', response.status);
            console.log('[LLM] OK:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();

                console.error('[LLM] Error body:', errorText);

                throw new ServiceUnavailableException(
                    `LM Studio request failed: ${response.status}`,
                );
            }

            const data =
                (await response.json()) as LmStudioChatResponse;

            console.log('[LLM] Raw response:', data);

            const result = {
                content: data.output?.[0]?.content ?? '',
                inputTokens: data.stats?.input_tokens,
                outputTokens: data.stats?.total_output_tokens,
                model: data.model_instance_id,
                responseId: data.response_id,
            };

            console.log('[LLM] Parsed result:', result);

            return result;
        } catch (error) {
            console.error('[LLM] Fetch error:', error);

            throw new ServiceUnavailableException(
                'Failed to communicate with LM Studio',
            );
        }
    }
}