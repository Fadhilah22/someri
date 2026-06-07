/*eslint-disable*/

import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { CreateSummaryDto } from './dto/createsummary.dto';
import { PrismaService } from '../prisma.service';
import { encode } from 'gpt-tokenizer';

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
            - Output the summary ONCE only. Do not repeat or regenerate the summary.
            - Stop immediately after the ## Conclusion section.
                
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
            - Output the summary ONCE only. Do not repeat or regenerate the summary.
            - Stop immediately after the ## Conclusion section.

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
            - Output the summary ONCE only. Do not repeat or regenerate the summary.
            - Stop immediately after the ## Conclusion section.

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
        short: 1024,  // was 512, still too low for systematic format
        medium: 2048,
        long: 4096,
    };

    // miscs
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

    // main logics
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

        const promptTokens = encode(prompt).length;
        const maxOutputTokens = this.maxTokens[createSummaryDto.length ?? 'short'];
        
        const result = await this.llmService.chat({
            model: 'qwen2.5-7b-instruct',
            input: prompt,
            context_length: promptTokens + maxOutputTokens + 256,
            temperature: 0.8,
            max_output_tokens: maxOutputTokens,
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
    
    async getSummaries(documentIds: string[]) {
        return this.prisma.summary.findMany({
            where: {
                documentId: {
                    in: documentIds,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async deleteSummary(id: string){
        return this.prisma.summary.delete({
            where: {
                id
            }
        });
    }
}
