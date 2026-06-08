<template>
    <section class="hero">
        <div>
            <h1>My Documents</h1>

            <p>
            Upload PDFs and generate AI-powered summaries.
            </p>
        </div>

        <button
            class="cta-btn"
            @click="showUploadModal = true"
        >
            + Add Document
        </button>
    </section>

    <DocumentList :documents="documents" />

    <UploadDocumentModal
        v-if="showUploadModal"
        @close="showUploadModal = false"
        @upload="handleUpload"
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
import { onMounted, ref, reactive } from 'vue'

import DocumentList from '@/components/DocumentCompo/DocumentList.vue'
import UploadDocumentModal from '@/components/DocumentCompo/UploadDocumentModal.vue'
import { getDocuments, uploadDocument } from '../services/documents'
import type { Document } from '../types'

const showUploadModal = ref(false)

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

async function loadDocuments() {
    documents.value = await getDocuments();
}

async function handleUpload(payload: {
    filename: string
    file: File | null
}) {
    console.log('HANDLE UPLOAD', payload)
    if (!payload.file) return

    try {
        await uploadDocument(
            payload.filename,
            payload.file,
        )

        showUploadModal.value = false
        await loadDocuments()
        showToast('Uploaded document successfully!', 'success')
    } catch (error) {
        console.error(error);
        const err = error as any
        const status = err?.response?.status
        const message = err?.response?.data?.message || 'Failed to upload document. Please try again.'
        
        if (status !== 200) {
            showToast(`Error ${status ? `(${status})` : ''}: ${message}`, 'error')
        }
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