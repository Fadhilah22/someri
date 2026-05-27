import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'));
  const error = ref<string | null>(null);
  const loading = ref(false);
  const router = useRouter();

  const isAuthenticated = () => !!token.value;

  async function register(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post('/auth/register', { email, password });
      token.value = res.data.access_token;
      localStorage.setItem('access_token', res.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post('/auth/login', { email, password });
      token.value = res.data.access_token;
      localStorage.setItem('access_token', res.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    localStorage.removeItem('access_token');
    router.push('/login');
  }

  return { token, error, loading, isAuthenticated, register, login, logout };
});