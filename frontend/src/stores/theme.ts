// src/stores/theme.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark');

  function toggle() {
    isDark.value = !isDark.value;
    const theme = isDark.value ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  function init() {
    const saved = localStorage.getItem('theme') ?? 'light';
    document.documentElement.setAttribute('data-theme', saved);
    isDark.value = saved === 'dark';
  }

  return { isDark, toggle, init };
});