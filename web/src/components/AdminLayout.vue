<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useApiBase } from '../composables/useApi'

const route = useRoute()
const auth = useAuth()
const { adminResourcesUrl } = useApiBase()

const navItems = ref([
  { path: '/admin', label: 'Overview', desc: 'Ringkasan data' },
])

function logout() {
  auth.logout()
  window.location.href = '/login'
}

function getAuthHeaders() {
  const t = auth.getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

onMounted(async () => {
  try {
    const r = await fetch(adminResourcesUrl(), { headers: getAuthHeaders() })
    if (r.ok) {
      const data = await r.json()
      const resources = data.resources || []
      navItems.value = [
        { path: '/admin', label: 'Overview', desc: 'Ringkasan data' },
        ...resources.map((res) => ({ path: `/admin/${res.id}`, label: res.label, desc: `Kelola ${res.label.toLowerCase()}` })),
      ]
    }
  } catch (_) {}
})
</script>

<template>
  <div class="flex flex-col min-h-[70vh]">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard Admin</h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">CMS — kelola konten berdasarkan model database</p>
      </div>
      <button
        type="button"
        @click="logout"
        class="self-start sm:self-center px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
      >
        Logout
      </button>
    </header>
    <div class="flex flex-col sm:flex-row gap-8">
      <aside class="w-full sm:w-56 shrink-0">
        <nav class="flex flex-wrap sm:flex-col gap-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="block py-2.5 px-4 rounded-lg text-sm font-medium transition-colors border border-transparent"
            :class="route.path === item.path
              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700'"
          >
            <span class="font-medium">{{ item.label }}</span>
            <span v-if="item.desc" class="hidden sm:block text-xs opacity-80 mt-0.5">{{ item.desc }}</span>
          </RouterLink>
        </nav>
      </aside>
      <div class="flex-1 min-w-0">
        <RouterView />
      </div>
    </div>
  </div>
</template>
