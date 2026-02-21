<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const auth = useAuth()

const message = ref('')
const loading = ref(true)
const error = ref('')
const apiBase = import.meta.env.VITE_API_URL || ''

function logout() {
  auth.logout()
  router.replace('/login')
}

onMounted(async () => {
  const token = auth.getToken()
  if (!token) {
    router.replace('/login')
    return
  }
  const adminUrl = apiBase ? `${apiBase.replace(/\/$/, '')}/admin` : '/api/admin'
  try {
    const r = await fetch(adminUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (r.status === 401) {
      auth.logout()
      router.replace('/login')
      return
    }
    if (!r.ok) {
      error.value = 'Gagal memuat data admin.'
      return
    }
    const data = await r.json()
    message.value = data.message || 'Admin area'
  } catch (_) {
    error.value = 'Koneksi gagal.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Admin</h1>
      <button
        type="button"
        @click="logout"
        class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
      >
        Logout
      </button>
    </div>
    <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>
    <div v-else-if="loading" class="text-neutral-500 dark:text-neutral-400">Memuat…</div>
    <div v-else class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
      <p class="text-neutral-700 dark:text-neutral-300">{{ message }}</p>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Anda masuk sebagai admin. Tambahkan konten dashboard di sini.</p>
    </div>
  </div>
</template>
