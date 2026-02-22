<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApiBase } from '../composables/useApi'

// Fallback statis (Phase 3: tanpa progress bar) — dipakai jika API tidak tersedia
const fallbackCategories = [
  { name: 'OS', level: 'Expert', items: ['Alpine', 'Debian', 'CentOS', 'RHEL'] },
  { name: 'Network', level: 'Advanced', items: ['TCP/IP', 'DNS', 'Firewall', 'VPN'] },
  { name: 'Cloud', level: 'Advanced', items: ['AWS', 'Terraform', 'Docker', 'Kubernetes'] },
  { name: 'Automation', level: 'Expert', items: ['Ansible', 'Bash', 'Python', 'CI/CD'] },
  { name: 'Monitoring', level: 'Advanced', items: ['Prometheus', 'Grafana', 'Uptime Kuma', 'Loki'] },
]

const { skillsUrl } = useApiBase()
const skillsFromApi = ref([])
const loading = ref(true)
const useFallback = ref(false)

/** Group skill by category name (from API: category). Level per skill. */
const categories = computed(() => {
  if (useFallback.value || !skillsFromApi.value.length) {
    return fallbackCategories.map((cat) => ({
      name: cat.name,
      level: cat.level,
      items: cat.items.map((name) => ({ name, level: cat.level })),
    }))
  }
  const byCat = new Map()
  for (const s of skillsFromApi.value) {
    const catName = s.category || 'Other'
    if (!byCat.has(catName)) byCat.set(catName, [])
    byCat.get(catName).push({ name: s.name, level: s.level || '—', icon_url: s.icon_url })
  }
  return Array.from(byCat.entries()).map(([name, items]) => ({
    name,
    level: items[0]?.level ?? '—',
    items: items.map((i) => ({ name: i.name, level: i.level, icon_url: i.icon_url })),
  }))
})

onMounted(async () => {
  try {
    const r = await fetch(skillsUrl())
    if (!r.ok) {
      useFallback.value = true
      return
    }
    const data = await r.json()
    if (Array.isArray(data.skills)) {
      skillsFromApi.value = data.skills
    } else {
      useFallback.value = true
    }
  } catch (_) {
    useFallback.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-12">
    <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Skills</h1>
    <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
      Tech stack dikelompokkan per kategori (data dari API). Level: Fundamental, Advanced, Expert — tanpa progress bar.
    </p>
    <p v-if="useFallback" class="text-sm text-amber-600 dark:text-amber-400">
      Database/API tidak tersedia; menampilkan data contoh.
    </p>
    <div v-if="loading" class="p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-pulse">
      Memuat skills…
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section
        v-for="cat in categories"
        :key="cat.name"
        class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">{{ cat.name }}</h2>
          <span class="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {{ cat.items[0]?.level ?? cat.level }}
          </span>
        </div>
        <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
          <li
            v-for="item in cat.items"
            :key="item.name"
            class="flex items-center gap-2"
          >
            <img
              v-if="item.icon_url"
              :src="item.icon_url"
              :alt="item.name"
              class="w-5 h-5 rounded object-contain"
            />
            <span v-else class="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
            <span>{{ item.name }}</span>
            <span
              v-if="cat.items.length > 1 && item.level"
              class="text-xs text-neutral-500 dark:text-neutral-500 ml-auto"
            >
              {{ item.level }}
            </span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
