<script setup>
// Phase 3: Blog post — data dari API by slug; fallback statis; syntax highlighting (highlight.js)
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'
import { useApiBase } from '../composables/useApi'

const fallbackPosts = [
  {
    slug: 'ansible-first-playbook',
    title: 'Ansible: First Playbook',
    date: '2025-01-15',
    content: `<p>Langkah pertama menulis playbook Ansible untuk provisioning server.</p><p>Contoh playbook:</p><pre><code class="language-yaml">- name: Install nginx
  hosts: webservers
  become: true
  tasks:
    - name: Install nginx package
      apt:
        name: nginx
        state: present</code></pre><p>Jalankan dengan <code>ansible-playbook playbook.yml</code>.</p>`,
  },
  {
    slug: 'loki-grafana-setup',
    title: 'Loki + Grafana untuk Log Aggregation',
    date: '2024-12-01',
    content: `<p>Setup logging terpusat dengan Loki dan Promtail. Contoh konfig Promtail:</p><pre><code class="language-yaml">server:
  http_listen_port: 9080
positions:
  filename: /tmp/positions.yaml
client:
  url: http://loki:3100/loki/api/v1/push</code></pre>`,
  },
  {
    slug: 'post-mortem-outage',
    title: 'Post-Mortem: Brief Outage 2024-Q4',
    date: '2024-11-20',
    content: '<p>Ringkasan insiden dan tindak lanjut. Root cause: misconfiguration. Tindak lanjut: runbook diperbarui, alert ditambah.</p>',
  },
]

const route = useRoute()
const { postBySlugUrl } = useApiBase()
const postFromApi = ref(null)
const loading = ref(true)
const useFallback = ref(false)

const post = computed(() => {
  const slug = route.params.slug
  if (postFromApi.value) {
    const d = postFromApi.value.published_at
    const date = d ? (typeof d === 'string' ? d.slice(0, 10) : d) : ''
    return {
      title: postFromApi.value.title,
      date,
      content: postFromApi.value.content ?? '',
    }
  }
  const p = fallbackPosts.find((f) => f.slug === slug)
  return p ? { title: p.title, date: p.date, content: p.content ?? '' } : null
})

const bodyRef = ref(null)

function highlightCode() {
  nextTick(() => {
    if (bodyRef.value) {
      bodyRef.value.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el)
      })
    }
  })
}

watch(post, highlightCode, { immediate: true })

onMounted(async () => {
  const slug = route.params.slug
  if (!slug) {
    loading.value = false
    return
  }
  try {
    const r = await fetch(postBySlugUrl(slug))
    if (r.ok) {
      const data = await r.json()
      postFromApi.value = data
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
  <article v-if="post" class="space-y-6">
    <RouterLink to="/blog" class="text-sm text-neutral-500 dark:text-neutral-400 hover:underline">← Blog</RouterLink>
    <header>
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">{{ post.title }}</h1>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ post.date }}</p>
    </header>
    <div
      ref="bodyRef"
      class="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
      v-html="post.content"
    />
  </article>
  <div v-else-if="loading" class="space-y-4">
    <p class="text-neutral-500 dark:text-neutral-400">Memuat…</p>
  </div>
  <div v-else class="space-y-4">
    <p class="text-neutral-500 dark:text-neutral-400">Post tidak ditemukan.</p>
    <RouterLink to="/blog" class="text-sm hover:underline">← Kembali ke Blog</RouterLink>
  </div>
</template>
