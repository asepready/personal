<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useApiBase } from '../composables/useApi'

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const { loginUrl } = useApiBase()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const sessionExpired = ref(route.query.reason === 'session')

async function onSubmit(e) {
  e.preventDefault()
  error.value = ''
  if (!username.value.trim() || !password.value) {
    error.value = 'Isi username dan password.'
    return
  }
  loading.value = true
  try {
    const r = await fetch(loginUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value.trim(), password: password.value }),
    })
    let data = {}
    try {
      data = await r.json()
    } catch (_) {}
    if (!r.ok) {
      error.value = r.status === 401 ? 'Username atau password salah.' : (data.error || data.message || 'Login gagal.')
      return
    }
    if (data.token) {
      auth.setToken(data.token)
      const redirect = route.query.redirect || '/admin'
      router.replace(redirect)
    } else {
      error.value = 'Respons tidak valid.'
    }
  } catch (err) {
    error.value = 'Koneksi gagal. Periksa API dan proxy.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center">
    <div class="w-full max-w-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 shadow-sm">
      <h1 class="text-xl font-bold text-neutral-900 dark:text-white mb-6">Login Admin</h1>
      <p v-if="sessionExpired" class="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg mb-4">
        Sesi habis. Silakan login lagi.
      </p>
      <form @submit="onSubmit" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
            placeholder="admin"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {{ loading ? 'Memproses…' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>
