<template>
<div class="overlay">
    <div class="modal">
        <h2>Generate Summary</h2>

        <div class="field">
            <label>Document ID</label>

            <input v-model="documentId">
        </div>

        <div class="field">
            <label>Style</label>

            <select v-model="style">
                <option value="systematic">Systematic</option>
                <option value="biteSize">Bite-size</option>
                <option value="chronological">Chronological</option>
            </select>
        </div>

        <div class="field">
            <label>Length</label>

            <select v-model="length">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
            </select>
        </div>

        <div class="field">
            <label>Language</label>

            <input v-model="language">
        </div>

        <div class="actions">
            <button
                class="secondary"
                @click="$emit('close')"
            >
                Cancel
            </button>

            <button
                class="primary"
                @click="generate"
            >
                Generate
            </button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits([
    'close',
    'generate'
])

const documentId = ref('')
const style = ref('academic')
const length = ref('medium')
const language = ref('english')

function generate() {
    emit('generate', {
        documentId: documentId.value,
        style: style.value,
        length: length.value,
        language: language.value,
    })
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
    width: 500px;
    max-width: 90vw;

    background: var(--color-surface);

    border-radius: 20px;

    padding: 24px;
}

.field {
    margin-top: 20px;
}

.field label {
    display: block;
    margin-bottom: 8px;
}

.field input {
    width: 100%;
    padding: 12px;

    border-radius: 10px;
    border: 1px solid var(--color-border);
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    margin-top: 24px;
}

.primary,
.secondary {
    border: none;
    cursor: pointer;

    padding: 12px 18px;
    border-radius: 10px;
}

.primary {
    background: var(--color-primary);
    color: white;
}

.secondary {
    background: var(--color-background);
}
</style>