<template>
    <div class="grid">
        <SummaryCard
            v-for="summary in summaries"
            :key="summary.id"
            :summary="summary"
            @click="$emit('select', summary)"
            @deleted="$emit('deleted', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import type { SummaryDisplay } from '../../types/index.ts';
import SummaryCard from './SummaryCard.vue'

defineProps<{
    summaries: SummaryDisplay[]
}>()

defineEmits<{
    (e: 'select', summary: SummaryDisplay): void
    (e: 'deleted', id: string): void
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