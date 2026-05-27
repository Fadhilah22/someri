<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Someri</h1>
        <p>Welcome back</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { animate } from 'motion';

const auth = useAuthStore();
const email = ref('');
const password = ref('');

async function handleLogin() {
  await auth.login(email.value, password.value);
}

function floatLabel(e: FocusEvent | Event, up: boolean) {
  const input = e.target as HTMLInputElement;
  const label = input.previousElementSibling as HTMLElement;
  const filled = input.value.length > 0;

  if (up || filled) {
    animate(label, { y: -30, scale: 0.82, color: '#000' }, { duration: 0.2 });
  } else {
    animate(label, { y: 0, scale: 1, color: '#999' }, { duration: 0.2 });
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.auth-header p {
  color: #666;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  position: relative;
  padding-top: 1rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.floating-label {
  position: absolute;
  top: 1.5rem;
  left: 0.9rem;
  font-size: 0.95rem;
  color: #999;
  pointer-events: none;
  transform-origin: left center;
}

.field input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  background: transparent;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.field input:focus {
  border-color: #000;
}

.error {
  color: #e53e3e;
  font-size: 0.875rem;
  text-align: center;
}

button {
  padding: 0.75rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
}

.auth-footer a {
  color: #000;
  font-weight: 500;
  text-decoration: none;
}
</style>