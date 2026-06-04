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

    <SummaryList :summaries="summaries" />

    <GenerateSummaryModal
        v-if="showGenerateModal"
        @close="showGenerateModal = false"
        @generate="handleGenerate"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import SummaryList from '@/components/SummaryCompo/SummaryList.vue'
import GenerateSummaryModal from '@/components/SummaryCompo/GenerateSummaryModal.vue'
import { generateSummary } from '../services/summary'

const showGenerateModal = ref(false)

const summaries = ref([
    {
        id: '1',
        title: 'Medical RAG Summary',
        createdAt: '2026-06-01'
    },
    {
        id: '2',
        title: 'Machine Learning Notes Summary',
        createdAt: '2026-06-02'
    }
])

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