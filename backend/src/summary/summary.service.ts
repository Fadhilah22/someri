/*eslint-disable*/

import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { CreateSummaryDto } from './dto/createsummary.dto';
import { PrismaService } from '../prisma.service';
import { encode } from 'gpt-tokenizer';
import puppeteer from 'puppeteer';
import MarkdownIt from 'markdown-it';

@Injectable()
export class SummaryService {
    constructor(
        private readonly llmService: LlmService, 
        private readonly prisma: PrismaService,
    ) {}

    private md = new MarkdownIt();

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
        short: 1024,
        medium: 2048,
        long: 4096,
    };

    private cleanMarkdown(text: string): string {
        return text
            .replace(/```markdown\s*/gi, '')
            .replace(/```md\s*/gi, '')
            .replace(/```/g, '')
            .replace(/\\n/g, '\n')
            .trim();
    }

    async createSummary(createSummaryDto: CreateSummaryDto) {
        const document = await this.prisma.document.findFirst({
            where: {
                id: createSummaryDto.DocumentId,
            },
        });

        if (document == null) {
            throw new NotFoundException(
                `Document with id: ${createSummaryDto.DocumentId} does not exist!`
            );
        }

        if (!document.extractedText) {
            throw new ServiceUnavailableException(
                `Document ${createSummaryDto.DocumentId} has not been processed yet. Please wait and try again.`
            )
        }

        const prompt = this.prompts[createSummaryDto.style || 'systematic']
            .replace('<<TEXT>>', document?.extractedText)
            .replace('<<LANG>>', createSummaryDto.language || 'english');

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
            throw new ServiceUnavailableException('LLM returned empty content');
        }

        const markdown = this.cleanMarkdown(result.content);

        return this.prisma.summary.create({
            data: {
                content: markdown,
                document: {
                    connect: {
                        id: createSummaryDto.DocumentId,
                    },
                },
            },
        });
    }

    async getSummaryById(id: string) {
        const summary = await this.prisma.summary.findUnique({
            where: { id },
            include: { document: true },
        });
    
        if (!summary) {
            throw new NotFoundException(`Summary with id: ${id} does not exist!`);
        }
    
        return summary;
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

    async generateSummaryPdf(summary: {
        documentName: string;
        createdAt: string;
        content: string;
        theme?: 'light' | 'dark';
    }): Promise<Buffer> {
        const rendered = this.md.render(summary.content);
        const html = this.buildHtml(summary, rendered);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'load' });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0',
                    bottom: '0',
                    left: '0',
                    right: '0',
                },
            });

            return Buffer.from(pdf);
        } finally {
            await browser.close();
        }
    }

    async deleteSummary(id: string) {
        return this.prisma.summary.delete({
            where: { id },
        });
    }

    private buildHtml(
        summary: { documentName: string; createdAt: string; theme?: 'light' | 'dark' },
        renderedContent: string,
    ): string {
        const date = new Date(summary.createdAt).toLocaleString();
        const theme = summary.theme ?? 'light';

        const themes = {
            light: {
                '--color-bg':            '#F4F4F4',
                '--color-surface':       '#ffffff',
                '--color-primary':       '#EE5717',
                '--color-primary-hover': '#d44a10',
                '--color-text':          '#2D2D2D',
                '--color-text-muted':    '#7a7a7a',
                '--color-border':        '#e0e0e0',
                '--color-border-focus':  '#EE5717',
                '--color-error':         '#e53e3e',
                '--color-success':       '#38a169',
                '--color-background':    '#F4F4F4',
            },
            dark: {
                '--color-bg':            '#1a1a1a',
                '--color-surface':       '#2D2D2D',
                '--color-primary':       '#EE5717',
                '--color-primary-hover': '#ff6a2b',
                '--color-text':          '#F4F4F4',
                '--color-text-muted':    '#9a9a9a',
                '--color-border':        '#3a3a3a',
                '--color-border-focus':  '#EE5717',
                '--color-error':         '#fc8181',
                '--color-success':       '#68d391',
                '--color-background':    '#1a1a1a',
            },
        };

        const vars = Object.entries(themes[theme])
            .map(([k, v]) => `${k}: ${v};`)
            .join('\n            ');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        :root {
            --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
            --mono: ui-monospace, Consolas, monospace;

            ${vars}
        }

        @page {
            margin: 32px;
            background: var(--color-surface);
        }

        body {
            font-family: var(--sans);
            font-size: 16px;
            line-height: 1.6;
            color: var(--color-text);
            background: var(--color-surface);
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .doc-name {
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--color-text);
            padding-bottom: 0.4rem;
            border-bottom: 1px solid var(--color-border);
            margin-bottom: 0.4rem;
        }

        .doc-date {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            margin-bottom: 2rem;
        }

        .content { line-height: 1.7; color: var(--color-text); }

        .content h1, .content h2, .content h3,
        .content h4, .content h5, .content h6 {
            color: var(--color-text);
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
        }

        .content h1, .content h2 {
            padding-bottom: 0.4rem;
            border-bottom: 1px solid var(--color-border);
        }

        .content p  { color: var(--color-text); margin: 0.75rem 0; }
        .content li { color: var(--color-text); margin: 0.25rem 0; }

        .content ul, .content ol {
            padding-left: 1.5rem;
            margin: 1rem 0;
        }

        .content a {
            color: var(--color-primary);
            text-decoration: underline;
        }

        .content hr {
            border: none;
            border-top: 1px solid var(--color-border);
            margin: 1.5rem 0;
        }

        .content blockquote {
            margin: 1rem 0;
            padding: 0.75rem 1rem;
            border-left: 4px solid var(--color-border);
            background: var(--color-bg);
            color: var(--color-text);
        }

        .content pre {
            overflow-x: auto;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid var(--color-border);
            background: var(--color-bg);
            color: var(--color-text);
            margin: 1rem 0;
        }

        .content code {
            font-family: var(--mono);
            color: var(--color-text);
        }

        .content pre code { background: transparent; padding: 0; }

        .content :not(pre) > code {
            padding: 0.15rem 0.4rem;
            border-radius: 4px;
            background: var(--color-bg);
            color: var(--color-text);
        }

        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }

        .content th, .content td {
            border: 1px solid var(--color-border);
            padding: 0.75rem;
            text-align: left;
            color: var(--color-text);
        }

        .content th {
            background: var(--color-bg);
            font-weight: 600;
        }

        .content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }

        table, pre, blockquote { page-break-inside: avoid; break-inside: avoid; }
        h1, h2, h3             { page-break-after: avoid;  break-after: avoid;  }
    </style>
</head>
<body>
    <div class="doc-name">${summary.documentName}</div>
    <div class="doc-date">${date}</div>
    <div class="content">${renderedContent}</div>
</body>
</html>`;
    }
}