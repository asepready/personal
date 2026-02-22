<script setup>
// Phase 3: Projects — data dari API (masalah → solusi → tools → hasil); fallback statis jika API down
import { ref, computed, onMounted } from 'vue'
import { useApiBase } from '../composables/useApi'

const fallbackProjects = [
  {
    title: 'Migration to Containerized Apps',
    problem: 'Deploy manual dan environment tidak konsisten.',
    solution: 'CI/CD dengan GitLab + Docker, satu pipeline untuk staging dan production.',
    tools: [{ name: 'Docker' }, { name: 'GitLab CI' }, { name: 'Ansible' }],
    result: 'Deploy time turun dari ~30 menit ke under 5 menit.',
    diagram_url: null,
  },
  {
    title: 'Centralized Logging',
    problem: 'Log tersebar di banyak server, sulit investigasi insiden.',
    solution: 'Aggregasi log ke Loki + Grafana, alert on error rate.',
    tools: [{ name: 'Loki' }, { name: 'Promtail' }, { name: 'Grafana' }],
    result: 'Waktu investigasi insiden berkurang ~50%.',
    diagram_url: null,
  },
  {
    title: 'High Availability Web Stack',
    problem: 'Single point of failure pada reverse proxy dan app.',
    solution: 'Load balancer + 2 node app, health check dan auto-failover.',
    tools: [{ name: 'Nginx' }, { name: 'Keepalived' }, { name: 'systemd' }],
    result: 'Uptime tercapai 99.9% (SLA).',
    diagram_url: null,
  },
]

const { projectsUrl } = useApiBase()
const projectsFromApi = ref([])
const loading = ref(true)
const useFallback = ref(false)

const projects = computed(() => {
  if (useFallback.value || !projectsFromApi.value.length) {
    return fallbackProjects.map((p) => ({
      title: p.title,
      problem: p.problem,
      solution: p.solution,
      result: p.result,
      tools: Array.isArray(p.tools) ? p.tools : [],
      diagram_url: p.diagram_url ?? null,
    }))
  }
  return projectsFromApi.value.map((p) => ({
    title: p.title,
    problem: p.problem ?? '',
    solution: p.solution ?? '',
    result: p.result ?? '',
    tools: Array.isArray(p.tools) ? p.tools : [],
    diagram_url: p.diagram_url ?? null,
  }))
})

function toolNames(tools) {
  if (!Array.isArray(tools)) return ''
  return tools.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean).join(', ')
}

onMounted(async () => {
  try {
    const r = await fetch(projectsUrl())
    if (!r.ok) {
      useFallback.value = true
      return
    }
    const data = await r.json()
    if (Array.isArray(data.projects)) {
      projectsFromApi.value = data.projects
    } else {
      useFallback.value = true
    }
  } catch {
    useFallback.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-12">
    <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Projects</h1>
    <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
      Studi kasus: masalah → solusi → tools → hasil terukur.
    </p>
    <p v-if="loading" class="text-neutral-500 dark:text-neutral-400">Memuat…</p>
    <div v-else class="space-y-8">
      <article
        v-for="(p, i) in projects"
        :key="i"
        class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-4"
      >
        <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">{{ p.title }}</h2>
        <img
          v-if="p.diagram_url"
          :src="p.diagram_url"
          :alt="`Diagram ${p.title}`"
          class="w-full max-w-2xl rounded-lg border border-neutral-200 dark:border-neutral-700"
        />
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt class="text-neutral-500 dark:text-neutral-400">Masalah</dt>
            <dd class="text-neutral-800 dark:text-neutral-200">{{ p.problem }}</dd>
          </div>
          <div>
            <dt class="text-neutral-500 dark:text-neutral-400">Solusi</dt>
            <dd class="text-neutral-800 dark:text-neutral-200">{{ p.solution }}</dd>
          </div>
          <div>
            <dt class="text-neutral-500 dark:text-neutral-400">Tools</dt>
            <dd class="text-neutral-800 dark:text-neutral-200">{{ toolNames(p.tools) || '—' }}</dd>
          </div>
          <div>
            <dt class="text-neutral-500 dark:text-neutral-400">Hasil</dt>
            <dd class="text-neutral-800 dark:text-neutral-200 font-medium">{{ p.result }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </div>
</template>
