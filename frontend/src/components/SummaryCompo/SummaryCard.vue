<template>
    <div class="card">
        <h3>{{ summary.title }}</h3>

        <p>
            {{ formatDate(summary.createdAt) }}
        </p>
    </div>
</template>

<script setup lang="ts">
interface Summary {
    id: string
    title: string
    createdAt: string
}

defineProps<{
    summary: Summary
}>()

function formatDate(date: string) {
    return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.card {
    background: var(--color-surface);

    padding: 20px;

    border-radius: 18px;
    border: 1px solid var(--color-border);

    box-shadow: var(--shadow);

    transition: .2s;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-2px);
}

.card h3 {
    margin: 0;
}

.card p {
    margin-top: 12px;
    color: var(--color-text-muted);
}
</style>