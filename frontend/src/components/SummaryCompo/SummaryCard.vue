<template>
    <Transition name="card">
        <div
            v-if="!deleted"
            class="card"
            @click="$emit('click')"
        >
            <div class="card-top">
                <h3>{{ summary.documentName }}</h3>

                <button
                    class="delete-btn"
                    @click.stop="handleDelete"
                >
                    ✕
                </button>
            </div>

            <p class="date">
                {{ formatDate(summary.createdAt) }}
            </p>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { deleteSummary } from '../../services/summary';
import type { SummaryDisplay } from '../../types'
import { ref } from 'vue'

const props = defineProps<{
    summary: SummaryDisplay
}>()

const emit = defineEmits(['click', 'deleted'])

const deleted = ref(false)

function formatDate(date: string) {
    return new Date(date).toLocaleDateString()
}

async function handleDelete() {
    await deleteSummary(props.summary.id)
    deleted.value = true
    emit('deleted', props.summary.id)
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

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: start;
}

.card h3 {
    margin: 0;
}

.card p {
    margin-top: 12px;
    color: var(--color-text-muted);
}

.delete-btn {
    width: 24px;
    height: 24px;

    border-radius: 50%;
    border: none;

    background: transparent;
    color: var(--color-text-muted);

    font-size: 11px;

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    opacity: 0;
    transition: opacity 0.2s, background 0.2s;
}

.card:hover .delete-btn {
    opacity: 1;
}

.delete-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--color-error);
}

/* transition */
.card-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        max-height 0.4s ease,
        padding 0.4s ease,
        margin 0.4s ease;

    overflow: hidden;
    max-height: 200px;
}

.card-leave-to {
    opacity: 0;
    transform: scale(0.95);
    max-height: 0;
    padding: 0;
    margin: 0;
}
</style>