<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const dark = ref(true)

const nav = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
  { path: '/status', label: 'Status' },
]

function toggleDark() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  try {
    localStorage.setItem('theme', dark.value ? 'dark' : 'light')
  } catch (_) {}
}

onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored === 'light') {
    dark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    dark.value = true
    document.documentElement.classList.add('dark')
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
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <RouterView />
    </main>
  </div>
</template>
