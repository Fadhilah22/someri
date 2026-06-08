<template>
<div class="overlay">
    <div class="modal">
        <div class="header">
            <h2>Generate Summary</h2>

            <button
                class="close-btn"
                @click="$emit('close')"
                :disabled="isLoading"
            >
                ✕
            </button>
        </div>

        <div class="field select-field">
            <label>Document</label>
            <select v-model="documentId" :disabled="isLoading">
                <option value="" disabled>Select a document</option>
                <option
                    v-for="doc in documents"
                    :key="doc.id"
                    :value="doc.id"
                >
                    {{ doc.filename }}
                </option>
            </select>
        </div>

        <div class="field select-field">
            <label>Style</label>
            <select v-model="style" :disabled="isLoading">
                <option value="systematic">Systematic</option>
                <option value="biteSize">BiteSize</option>
                <option value="chronological">Chronological</option>
            </select>
        </div>

        <div class="field select-field">
            <label>Length</label>
            <select v-model="length" :disabled="isLoading">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
            </select>
        </div>

        <div class="field select-field">
            <label>Language</label>
            <select v-model="language" :disabled="isLoading">
                <option
                    v-for="lang in languages"
                    :key="lang"
                    :value="lang"
                >
                    {{ lang }}
                </option>
            </select>
        </div>

        <div class="actions">
            <button
                class="secondary"
                @click="$emit('close')"
                :disabled="isLoading"
            >
                Cancel
            </button>

            <button
                class="primary"
                @click="generate"
                :disabled="isLoading"
            >
                <span v-if="isLoading" class="spinner" />
                {{ isLoading ? 'Generating...' : 'Generate' }}
            </button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDocuments } from '../../services/documents';

const props = defineProps<{
    isLoading?: boolean
}>()

const languages = [
    'English', 'Mandarin Chinese', 'Hindi', 'Spanish', 'French',
    'Arabic', 'Bengali', 'Portuguese', 'Russian', 'Urdu',
    'Indonesian', 'German', 'Japanese', 'Korean', 'Turkish',
    'Vietnamese', 'Italian', 'Thai', 'Polish', 'Dutch',
]

const emit = defineEmits(['close', 'generate'])

const documents = ref<{ id: string; filename: string }[]>([])
const documentId = ref('')
const style = ref('systematic')
const length = ref('medium')
const language = ref('English')

onMounted(async () => {
    documents.value = await getDocuments()
})

function generate() {
    if (!documentId.value || props.isLoading) return

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

.field input,
.field select {
    box-sizing: border-box;
}

.field input {
    width: 100%;
    padding: 12px;

    border-radius: 10px;
    border: 1px solid var(--color-border);
}

.field select {
    width: 100%;
    padding: 12px;

    border-radius: 10px;
    border: 1px solid var(--color-border);

    background: var(--color-surface);
    color: var(--color-text);

    font: inherit;
    box-sizing: border-box;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    cursor: pointer;
}

.select-field {
    position: relative;
}

.field select {
    padding-right: 40px;
}

.select-field::after {
    content: '⌄';

    position: absolute;
    right: 14px;
    top: 43px;

    pointer-events: none;
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

.primary:disabled,
.secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.primary {
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
}

.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>