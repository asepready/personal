<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useApiBase } from '../../composables/useApi'

const router = useRouter()
const auth = useAuth()
const { adminUrl, adminResourcesUrl, adminResourceUrl } = useApiBase()

const LIST_KEYS = {
  'skill-categories': 'categories',
  'skills': 'skills',
  'tools': 'tools',
  'tags': 'tags',
  'projects': 'projects',
  'posts': 'posts',
}

const message = ref('')
const loading = ref(true)
const error = ref('')
const resources = ref([])
const counts = ref({})

function getAuthHeaders() {
  const t = auth.getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

onMounted(async () => {
  const token = auth.getToken()
  if (!token) {
    router.replace('/login')
    return
  }
  try {
    const rAdmin = await fetch(adminUrl(), { headers: getAuthHeaders() })
    if (rAdmin.status === 401) {
      auth.logout()
      router.replace('/login')
      return
    }
    if (rAdmin.ok) {
      const data = await rAdmin.json()
      message.value = data.message || 'Admin area'
    } else {
      error.value = 'Gagal memuat data admin.'
    }

    const rRes = await fetch(adminResourcesUrl(), { headers: getAuthHeaders() })
    if (rRes.ok) {
      const data = await rRes.json()
      resources.value = data.resources || []
      await Promise.all(
        resources.value.map(async (res) => {
          try {
            const r = await fetch(adminResourceUrl(res.id), { headers: getAuthHeaders() })
            if (r.ok) {
              const d = await r.json()
              const key = LIST_KEYS[res.id]
              counts.value[res.id] = (d[key] || []).length
            } else {
              counts.value[res.id] = 0
            }
          } catch (_) {
            counts.value[res.id] = 0
          }
        })
      )
    }
  } catch (_) {
    error.value = 'Koneksi gagal.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">Overview</h2>
    <p v-if="error" class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
    <div v-else-if="loading" class="text-neutral-500 dark:text-neutral-400">Memuat…</div>
    <template v-else>
      <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-4">
        <p class="text-neutral-700 dark:text-neutral-300">{{ message }}</p>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          Kelola konten secara dinamis berdasarkan model database (CMS/LMS). Pilih resource di bawah atau dari menu samping.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-for="res in resources"
          :key="res.id"
          :to="`/admin/${res.id}`"
          class="block p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
        >
          <h3 class="font-semibold text-neutral-900 dark:text-white">{{ res.label }}</h3>
          <p class="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mt-1">{{ counts[res.id] ?? '—' }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Tambah / edit / hapus</p>
        </RouterLink>
      </div>
    </template>
  </div>
</template>
