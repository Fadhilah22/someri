<template>
<div class="overlay">
    <div class="modal">
        <div class="header">
            <h2>Upload Document</h2>

            <button
                class="close-btn"
                @click="$emit('close')"
            >
                ✕
            </button>
        </div>

        <div class="field">
            <label>Document Name</label>

            <input
                v-model="documentName"
                placeholder="Optional"
            >
        </div>

        <div class="field">
            <label>PDF File</label>

            <input
                type="file"
                accept=".pdf"
                @change="handleFile"
            >
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
                @click="upload"
            >
                Upload
            </button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits([
    'close',
    'upload'
])

const documentName = ref('')
const file = ref<File | null>(null)

function handleFile(event: Event) {
    const target = event.target as HTMLInputElement

    if (target.files?.length) {
        file.value = target.files[0]
    }
}

function upload() {
    emit('upload', {
        filename: documentName.value,
        file: file.value,
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

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 12px;
}

.header h2 {
    margin: 0;
    color: var(--color-text);
}
</style>