<template>
  <GridBackground>
    <div class="auth-wrapper">
        <div class="auth-card" 
          @mousemove="handleGlow"
          :style="{
            '--mouse-x': mouseX + 'px',
            '--mouse-y': mouseY + 'px',
          }"
        >
        <div class="auth-header">
          <img :src="logo" alt="Someri Logo" class="logo" />
          <h1>Someri</h1>
          <p>Welcome back</p>
        </div>

        <form 
          @submit.prevent="handleLogin" class="auth-form">
          <div class="field">
            <label class="floating-label">Email</label>
            <input
            v-model="email"
              type="email"
              required
              autocomplete="email"
              @focus="floatLabel($event, true)"
              @blur="floatLabel($event, false)"
            />
          </div>

          <div class="field">
            <label class="floating-label">Password</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              @focus="floatLabel($event, true)"
              @blur="floatLabel($event, false)"
            />
          </div>

          <p v-if="auth.error" class="error">{{ auth.error }}</p>

          <button type="submit" :disabled="auth.loading">
            {{ auth.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account?
          <RouterLink to="/register">Register</RouterLink>
        </p>
      </div>

      <button class="theme-toggle" @click="theme.toggle()" :title="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ theme.isDark ? '☀️' : '🌙' }}
      </button>
    </div>
  </GridBackground>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.svg';
import GridBackground from '../components/ui/GridBackground.vue';
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { animate } from 'motion';
import { useThemeStore } from '../stores/theme';

const auth = useAuthStore();
const email = ref('');
const password = ref('');
const theme = useThemeStore();

async function handleLogin() {
  await auth.login(email.value, password.value);
}

function floatLabel(e: FocusEvent | Event, up: boolean) {
  const input = e.target as HTMLInputElement;
  const label = input.previousElementSibling as HTMLElement;
  const filled = input.value.length > 0;

  if (up || filled) {
    animate(label, { y: -40, scale: 0.82, color: 'var(--color-primary)' }, { duration: 0.2 });
  } else {
    animate(label, { y: 0, scale: 1, color: 'var(--color-text-muted)' }, { duration: 0.2 });
  }
}

const mouseX = ref(0);
const mouseY = ref(0);

function handleGlow(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
}
</script>

<style scoped>

.logo {
    width: 256px;
    height: auto;
}

.theme-toggle {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  /* border: 1px solid var(--color-border); */
  background: var(--color-surface);
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
  transition: background 0.2s;
  padding: 0;
}

.theme-toggle:hover:not(:disabled) {
  background: var(--color-bg);
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: var(--color-bg); */
  border: none;
}

.auth-card {
  position: relative;
  background: var(--color-surface);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  isolation: isolate;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-text);
}

.auth-header p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.auth-form { 
  display: flex; 
  flex-direction: column; 
  gap: 1.25rem; 
}

.auth-form::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  background:
    radial-gradient(
      220px circle at var(--mouse-x) var(--mouse-y),
      color-mix(in srgb, var(--color-primary) 18%, transparent),
      transparent 70%
    );

  transition: background 0.08s linear;
}

.auth-form > * {
  position: relative;
  z-index: 1;
}

.field {
  position: relative;
  padding-top: 1rem;
}

.floating-label {
  position: absolute;
  top: 1.5rem;
  left: 0.9rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  pointer-events: none;
  transform-origin: left center;
}

.field input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.field input:focus {
  border-color: var(--color-border-focus);
}

.error {
  color: var(--color-error);
  font-size: 0.875rem;
  text-align: center;
}

button {
  padding: 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
}
</style>