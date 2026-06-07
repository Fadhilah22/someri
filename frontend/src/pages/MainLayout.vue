<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <h2>Someri</h2>
      </div>

      <nav class="menu">
        <RouterLink to="/" class="menu-item" active-class="active">
          Home
        </RouterLink>

        <RouterLink to="/Documents" class="menu-item" active-class="active">
          Documents
        </RouterLink>

        <RouterLink to="/Summaries" class="menu-item" active-class="active">
          Summaries
        </RouterLink>
      </nav>
    </aside>

    <!-- Dynamic Page Content -->
    <main class="content">
      <RouterView />
    </main>

    <button
        class="theme-toggle"
        @click="theme.toggle()"
        :title="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        {{ theme.isDark ? '☀️' : '🌙' }}
      </button>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from '../stores/theme'

const theme = useThemeStore()
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--sans);
}

.sidebar {
  width: 240px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);

  padding: 24px 18px;

  display: flex;
  flex-direction: column;
}

.logo {
  margin-bottom: 40px;
}

.logo h2 {
  margin: 0;
  color: var(--color-text);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  color: var(--color-text-muted);
  text-decoration: none;

  padding: 12px 14px;
  border-radius: 10px;

  transition: 0.2s;
}

.menu-item:hover,
.menu-item.active {
  background: var(--color-primary);
  color: white;
}

.content {
  flex: 1;
  padding: 48px;
}

.theme-toggle {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;

  width: 2.5rem;
  height: 2.5rem;

  border: 1px solid var(--color-border);
  border-radius: 50%;

  background: var(--color-surface);
  color: var(--color-text);

  cursor: pointer;
  font-size: 1.1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: var(--shadow);

  transition: 0.2s;
}

.theme-toggle:hover {
  background: var(--color-bg);
}
</style>