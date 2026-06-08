<template>
    <div
        class="overlay"
        @click.self="$emit('close')"
    >
        <div class="modal">
            <div class="header">
                <h2>{{ summary?.documentName }}</h2>

                <div class="actions">
                    <button @click="downloadPdf">
                        📄
                    </button>
                
                    <button @click="$emit('close')">
                        ✕
                    </button>
                </div>
            </div>

            <p class="date">
                {{ formatDate(summary?.createdAt) }}
            </p>

            <div class="print-content">
                <div
                    class="content markdown-body"
                    v-html="renderedContent"
                />
                    <!-- {{ summary?.content }}
                </div> -->
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SummaryDisplay } from '../../types'
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { downloadSummaryPdf } from '../../services/summary';
// import { downloadSummaryPdf } from '../../services/summary.service'

const props = defineProps<{
    summary: SummaryDisplay | null
}>()

const md = new MarkdownIt()

const renderedContent = computed(() =>
    DOMPurify.sanitize(
        md.render(props.summary?.content ?? '')
    )
)

// defineProps<{
//     summary: SummaryDisplay | null
// }>()

defineEmits(['close'])

function formatDate(date?: string) {
    if (!date) return ''
    return new Date(date).toLocaleString()
}

// function downloadPdf() {
//     window.print()
// }

async function downloadPdf() {
    if (!props.summary) return

    await downloadSummaryPdf(
        props.summary.id,
        props.summary.documentName,
    )
}
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;

    background: rgba(0, 0, 0, .4);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 100;
}

.modal {
    width: 900px;
    max-width: 90vw;
    max-height: 85vh;

    overflow-y: auto;

    background: var(--color-surface);

    border-radius: 20px;

    padding: 24px;

    box-shadow: var(--shadow);
}

.actions {
    display: flex;
    gap: 0.75rem; /* adjust as needed */
}

.actions button {
    cursor: pointer;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 12px;
}

.header h2 {
    margin: 0;
    color: var(--color-text);
}

.close-btn {
    border: none;
    background: transparent;

    cursor: pointer;

    font-size: 18px;
}

.date {
    color: var(--color-text-muted);

    margin-bottom: 24px;
}

.print-content {
    width: 100%;
}

.content {
    line-height: 1.7;
    color: var(--color-text);
}

.content :deep(*) {
    color: inherit;
}



.content :deep(h1),
.content :deep(h2),
.content :deep(h3),
.content :deep(h4),
.content :deep(h5),
.content :deep(h6) {
    color: var(--color-text);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.content :deep(h1),
.content :deep(h2) {
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--color-border);
}

.content :deep(p),
.content :deep(li),
.content :deep(span),
.content :deep(strong),
.content :deep(em),
.content :deep(blockquote) {
    color: var(--color-text);
}

.content :deep(ul),
.content :deep(ol) {
    padding-left: 1.5rem;
    margin: 1rem 0;
}

.content :deep(a) {
    color: var(--color-primary);
    text-decoration: underline;
}

.content :deep(hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 1.5rem 0;
}

.content :deep(blockquote) {
    margin: 1rem 0;
    padding: 0.75rem 1rem;

    border-left: 4px solid var(--color-border);

    background: var(--color-background);

    color: var(--color-text);
}

.content :deep(pre) {
    overflow-x: auto;

    padding: 1rem;

    border-radius: 8px;
    border: 1px solid var(--color-border);

    background: var(--color-background);

    color: var(--color-text);
}

.content :deep(code) {
    font-family: monospace;
    color: var(--color-text);
}

.content :deep(pre code) {
    background: transparent;
    padding: 0;
}

.content :deep(:not(pre) > code) {
    padding: 0.15rem 0.4rem;

    border-radius: 4px;

    background: var(--color-background);

    color: var(--color-text);
}

.content :deep(table) {
    width: 100%;

    border-collapse: collapse;

    margin: 1rem 0;

    color: var(--color-text);
}

.content :deep(th),
.content :deep(td) {
    border: 1px solid var(--color-border);

    padding: 0.75rem;

    text-align: left;

    color: var(--color-text);
}

.content :deep(th) {
    background: var(--color-background);

    font-weight: 600;
}

.content :deep(img) {
    max-width: 100%;
    height: auto;

    border-radius: 8px;
}

.content :deep(thead) {
    background: var(--color-background);
}
</style>