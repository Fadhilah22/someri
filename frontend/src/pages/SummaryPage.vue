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
        :is-loading="isGenerating"
        @close="showGenerateModal = false"
        @generate="handleGenerate"
    />

    <!-- Toast Notification -->
    <Transition name="toast">
        <div 
            v-if="toast.visible" 
            class="toast" 
            :class="toast.type"
        >
            <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
            {{ toast.message }}
        </div>
    </Transition>
</template>

<script setup lang="ts"> 
import { computed, onMounted, reactive, ref } from 'vue' 

import SummaryList from '@/components/SummaryCompo/SummaryList.vue' 
import GenerateSummaryModal from '@/components/SummaryCompo/GenerateSummaryModal.vue' 
import SummaryDetailModal from '@/components/SummaryCompo/SummaryDetailModal.vue' 
import { generateSummary } from '../services/summary' 
import { getDocuments } from '../services/documents' 
import type { Document, SummaryDisplay } from '../types' 

const selectedSummary = ref<SummaryDisplay | null>(null) 
const showDetailModal = ref(false) 
const showGenerateModal = ref(false) 
const isGenerating = ref(false)

const documents = ref<Document[]>([]) 

const toast = reactive({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string, type: 'success' | 'error', duration = 3500) {
    if (toastTimer) clearTimeout(toastTimer)
    toast.message = message
    toast.type = type
    toast.visible = true
    toastTimer = setTimeout(() => {
        toast.visible = false
    }, duration)
}

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
    documents.value = await getDocuments()
} 

async function handleGenerate(payload: { 
    documentId: string 
    style: string 
    length: string 
    language: string 
}) { 
    isGenerating.value = true

    try { 
        await generateSummary( 
            payload.documentId, 
            payload.style, 
            payload.length, 
            payload.language, 
            1, 
            1, 
        ) 

        showGenerateModal.value = false
        await loadDocuments()
        showToast('Summary generated successfully!', 'success')
    } catch (error: any) {
        const status = error?.response?.status
        const message = error?.response?.data?.message || 'Failed to generate summary. Please try again.'

        if (status !== 200) {
            showToast(`Error ${status ? `(${status})` : ''}: ${message}`, 'error')
        }

        console.error(error) 
    } finally {
        isGenerating.value = false
    }
} 

onMounted(() => { 
    loadDocuments()
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

/* Toast */
.toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-width: 360px;
}

.toast.success {
    background: #22c55e;
}

.toast.error {
    background: #ef4444;
}

.toast-icon {
    font-size: 16px;
    font-weight: 700;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>