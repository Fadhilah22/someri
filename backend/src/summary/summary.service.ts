/*eslint-disable*/

import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { CreateSummaryDto } from './dto/createsummary.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SummaryService {
    constructor(
        private readonly llmService: LlmService, 
        private readonly prisma: PrismaService,
    ) {}

    private prompts = {
        systematic: `
            You are an AI study assistant.
                
            Summarize the provided material for students.
                
            STRICT REQUIREMENTS:
            - Output ONLY Markdown.
            - Never output JSON.
            - Never output code blocks unless the source contains code.
            - Preserve important concepts, terminology, facts, dates, formulas, and conclusions.
            - Use concise academic language.
            - Please create the summary in <<LANG>> language.
                
            OUTPUT FORMAT:
                
            # Summary
                
            ## Abstract
            Short overview of the material.
                
            ## Main Concepts
            - ...
                
            ## Methodology / Process
            - ...
                
            ## Findings / Results
            - ...
                
            ## Key Terms
            | Term | Explanation |
            |------|-------------|
            | ... | ... |
                
            ## Conclusion
            - ...
                
            CONTENT:
                
            <<TEXT>>
        `,
        biteSize: `
            You are an AI study assistant.

            Summarize the provided material for students.

            STRICT REQUIREMENTS:
            - Output ONLY Markdown.
            - Never output JSON.
            - Never output code blocks unless the source contains code.
            - Focus on quick learning and memorization.
            - Keep explanations short and direct.
            - Please create the summary in <<LANG>> language.

            OUTPUT FORMAT:

            # Quick Summary

            ## In One Paragraph
            ...

            ## Key Points
            - ...
            - ...
            - ...

            ## Must Remember
            - ...
            - ...
            - ...

            ## Key Terms
            | Term | Meaning |
            |------|---------|
            | ... | ... |

            ## Exam Tips
            - ...

            CONTENT:

            <<TEXT>>
        `,
        chronological: `
            You are an AI study assistant.

            Summarize the provided material for students.

            STRICT REQUIREMENTS:
            - Output ONLY Markdown.
            - Never output JSON.
            - Never output code blocks unless the source contains code.
            - Present information in the order it occurs in the source.
            - Preserve timelines, sequences, and cause-effect relationships.
            - Please create the summary in <<LANG>> language.

            OUTPUT FORMAT:

            # Chronological Summary

            ## Overview
            ...

            ## Timeline

            ### Step 1
            ...

            ### Step 2
            ...

            ### Step 3
            ...

            ## Important Events / Milestones
            | Event | Significance |
            |--------|-------------|
            | ... | ... |

            ## Final Outcome
            ...

            CONTENT:

            <<TEXT>>
        `,
    };

    private maxTokens = {
        short: 200,
        medium: 500,
        long: 1000
    }

    async createSummary(createSummaryDto: CreateSummaryDto) {
        const document = await this.prisma.document.findFirst({
            where: {
                id: createSummaryDto.DocumentId,
            },
        })

        if (document == null){
            throw new NotFoundException(
                `Document with id: ${createSummaryDto.DocumentId} does not exist!`
            );
        }

        const prompt = this.prompts[createSummaryDto.style || "systematic"]
            .replace("<<TEXT>>", document?.extractedText)
            .replace("<<LANG>>", createSummaryDto.language || "english");
        
        const result = await this.llmService.chat({
            model: 'qwen2.5-7b-instruct',
            input: prompt,
            context_length: prompt.length,
            temperature: 0.8,
            max_output_tokens: this.maxTokens[createSummaryDto.length ?? 'short'],
        });

        if (!result.content) {
            throw new ServiceUnavailableException(
                'LLM returned empty content',
            );
        }

        const markdown = this.cleanMarkdown(
            result.content,
        );

        return this.prisma.summary.create({
            data: {
                content : markdown,
                document: {
                    connect: {
                        id: createSummaryDto.DocumentId,
                    }
                }
            },
        });
    }

    private cleanMarkdown(
        text: string,
    ): string {
        return text
            .replace(/```markdown\s*/gi, '')
            .replace(/```md\s*/gi, '')
            .replace(/```/g, '')
            .replace(/\\n/g, '\n')
            .trim();
    }
}
