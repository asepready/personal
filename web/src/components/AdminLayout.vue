<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const auth = useAuth()

function logout() {
  auth.logout()
  window.location.href = '/login'
}
</script>

<template>
  <div class="flex flex-col min-h-[70vh]">
    <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard Admin</h1>
      <button
        type="button"
        @click="logout"
        class="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium"
      >
        Logout
      </button>
    </div>
    <div class="flex flex-col sm:flex-row gap-8">
      <aside class="w-full sm:w-52 shrink-0">
        <nav class="flex sm:flex-col gap-1">
          <RouterLink
            to="/admin"
            class="block py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/admin' ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'"
          >
            Overview
          </RouterLink>
          <RouterLink
            to="/admin/categories"
            class="block py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/admin/categories' ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'"
          >
            Kategori Skill
          </RouterLink>
          <RouterLink
            to="/admin/skills"
            class="block py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === '/admin/skills' ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'"
          >
            Skills
          </RouterLink>
        </nav>
      </aside>
      <div class="flex-1 min-w-0">
        <RouterView />
      </div>
    </div>
  </div>
</template>
