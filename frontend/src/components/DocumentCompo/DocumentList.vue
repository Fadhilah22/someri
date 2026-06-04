<template>
    <div class="grid">
        <DocumentCard
            v-for="document in documents"
            :key="document.id"
            :document="document"
        />
    </div>
</template>

<script setup lang="ts">
import DocumentCard from './DocumentCard.vue'

interface Document {
    id: string
    originalName: string
    status: string
    createdAt: string
}

defineProps<{
    documents: Document[]
}>()
</script>

<style scoped>
.grid {
    display: grid;

    gap: 20px;

    grid-template-columns:
        repeat(auto-fill, minmax(280px, 1fr));
}
</style>