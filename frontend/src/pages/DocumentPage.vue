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
</template>

<script setup lang="ts">
import { ref } from 'vue'

import DocumentList from '@/components/DocumentCompo/DocumentList.vue'
import UploadDocumentModal from '@/components/DocumentCompo/UploadDocumentModal.vue'
import { uploadDocument } from '../services/documents'

interface Document {
    id: string
    originalName: string
    createdAt: string
}

const showUploadModal = ref(false)

const documents = ref<Document[]>([
    {
        id: '1',
        originalName: 'Medical-RAG.pdf',
        createdAt: '2026-06-01'
    },
    {
        id: '2',
        originalName: 'Machine-Learning-Notes.pdf',
        createdAt: '2026-06-02'
    },
    {
        id: '3',
        originalName: 'Database-System.pdf',
        createdAt: '2026-06-03'
    }
])

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