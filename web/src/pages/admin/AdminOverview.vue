<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useApiBase } from '../../composables/useApi'

const router = useRouter()
const auth = useAuth()
const { adminUrl, adminCategoriesUrl, adminSkillsUrl } = useApiBase()

const message = ref('')
const loading = ref(true)
const error = ref('')
const stats = ref({ categories: 0, skills: 0 })
const statsLoading = ref(true)

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
    const [rAdmin, rCat, rSkills] = await Promise.all([
      fetch(adminUrl(), { headers: getAuthHeaders() }),
      fetch(adminCategoriesUrl(), { headers: getAuthHeaders() }),
      fetch(adminSkillsUrl(), { headers: getAuthHeaders() }),
    ])
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
    if (rCat.ok) {
      const d = await rCat.json()
      stats.value.categories = (d.categories || []).length
    }
    if (rSkills.ok) {
      const d = await rSkills.json()
      stats.value.skills = (d.skills || []).length
    }
  } catch (_) {
    error.value = 'Koneksi gagal.'
  } finally {
    loading.value = false
    statsLoading.value = false
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
          Gunakan menu samping untuk mengelola <strong>Kategori Skill</strong> dan <strong>Skills</strong>.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RouterLink
          to="/admin/categories"
          class="block p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
        >
          <h3 class="font-semibold text-neutral-900 dark:text-white">Kategori Skill</h3>
          <p v-if="statsLoading" class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Memuat…</p>
          <p v-else class="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mt-1">{{ stats.categories }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Tambah / edit / hapus kategori</p>
        </RouterLink>
        <RouterLink
          to="/admin/skills"
          class="block p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
        >
          <h3 class="font-semibold text-neutral-900 dark:text-white">Skills</h3>
          <p v-if="statsLoading" class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Memuat…</p>
          <p v-else class="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mt-1">{{ stats.skills }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Tambah / edit / hapus skill per kategori</p>
        </RouterLink>
      </div>
    </template>
  </div>
</template>
