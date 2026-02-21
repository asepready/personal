<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const dark = ref(true)
const auth = useAuth()
const mobileMenuOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => { mobileMenuOpen.value = false })

const nav = computed(() => {
  const items = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
    { path: '/status', label: 'Status' },
  ]
  if (auth.isLoggedIn()) {
    items.push({ path: '/admin', label: 'Admin' })
  } else {
    items.push({ path: '/login', label: 'Login' })
  }
  return items
})

function toggleDark() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  try {
    localStorage.setItem('theme', dark.value ? 'dark' : 'light')
  } catch (_) {}
}

onMounted(() => {
  const stored = localStorage.getItem('theme')
  const isDark = stored !== 'light'
  dark.value = isDark
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors">
    <header class="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur">
      <nav class="max-w-4xl mx-auto px-4 sm:px-6 flex justify-between items-center h-14">
        <RouterLink to="/" class="text-lg font-bold tracking-tight text-neutral-900 dark:text-white hover:opacity-80">
          SYSADMIN.LOG
        </RouterLink>
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-6 text-sm">
            <RouterLink
              v-for="item in nav"
              :key="item.path"
              :to="item.path"
              class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              exact-active-class="!text-neutral-900 dark:!text-white font-medium"
            >
              {{ item.label }}
            </RouterLink>
          </div>
          <!-- Mobile menu button -->
          <div class="sm:hidden flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle menu"
              class="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <span v-if="!mobileMenuOpen">☰</span>
              <span v-else>✕</span>
            </button>
          </div>
          <button
            type="button"
            aria-label="Toggle dark mode"
            class="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            @click="toggleDark"
          >
            <span v-if="dark" class="text-amber-400">☀</span>
            <span v-else class="text-neutral-500">☾</span>
          </button>
        </div>
      </nav>
    </header>
    <!-- Mobile menu dropdown (Phase 2: responsive) -->
    <div
      v-show="mobileMenuOpen"
      class="sm:hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-4 py-3"
    >
      <nav class="flex flex-col gap-1 text-sm">
        <RouterLink
          v-for="item in nav"
          :key="item.path"
          :to="item.path"
          class="py-2 px-3 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
          exact-active-class="!text-neutral-900 dark:!text-white font-medium !bg-neutral-100 dark:!bg-neutral-800"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <RouterView />
    </main>
  </div>
</template>
