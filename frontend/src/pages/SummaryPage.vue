<template>
    <section class="hero">
        <div>
            <h1>My Summaries</h1>

            <p>
                AI-generated summaries from your uploaded documents.
            </p>
        </div>

        <button
            class="cta-btn"
            @click="showGenerateModal = true"
        >
            + Generate Summary
        </button>
    </section>

    <SummaryList 
        :summaries="summaries"
        @select="openSummary"
    />

    <SummaryDetailModal
        v-if="showDetailModal"
        :summary="selectedSummary"
        @close="showDetailModal = false"
    />

    <GenerateSummaryModal
        v-if="showGenerateModal"
        @close="showGenerateModal = false"
        @generate="handleGenerate"
    />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SummaryList from '@/components/SummaryCompo/SummaryList.vue'
import GenerateSummaryModal from '@/components/SummaryCompo/GenerateSummaryModal.vue'
import SummaryDetailModal from '@/components/SummaryCompo/SummaryDetailModal.vue'
import { generateSummary } from '../services/summary'
import { getDocuments } from '../services/documents'
import type { Document, SummaryDisplay } from '../types'

const selectedSummary = ref<SummaryDisplay | null>(null)
const showDetailModal = ref(false)

const showGenerateModal = ref(false)

const documents = ref<Document[]>([])

const summaries = computed<SummaryDisplay[]>(() => {
    return documents.value.flatMap(doc =>
        doc.summary.map(summary => ({
            ...summary,
            documentName: doc.originalName
        }))
    )
})

function openSummary(summary: SummaryDisplay) {
    selectedSummary.value = summary
    showDetailModal.value = true
}

async function loadDocuments() {
    documents.value = await getDocuments();
}

async function handleGenerate(payload: {
    documentId: string
    style: string
    length: string
    language: string
}) {
    console.log('GENERATE SUMMARY', payload)

    try {
        // await generateSummary(...)
        await generateSummary(
            payload.documentId,
            payload.style,
            payload.length,
            payload.language,
            1,
            1,
        )

        showGenerateModal.value = false
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    console.log("loads page.");
    loadDocuments();
})
</script>

<style scoped>
.hero {
    background: var(--color-surface);

    padding: 32px;

    border-radius: 20px;

    margin-bottom: 32px;

    box-shadow: var(--shadow);

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.hero h1 {
    margin: 0;
    padding-bottom: 5%;

    color: var(--color-text);
}

.hero p {
    color: var(--color-text-muted);
}

.cta-btn {
    border: none;

    cursor: pointer;

    padding: 14px 20px;

    border-radius: 10px;

    background: var(--color-primary);
    color: white;

    font-size: 15px;

    transition: .2s;
}

.cta-btn:hover {
    background: var(--color-primary-hover);
}
</style>