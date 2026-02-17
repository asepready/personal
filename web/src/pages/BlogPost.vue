<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const posts = [
  { slug: 'ansible-first-playbook', title: 'Ansible: First Playbook', date: '2025-01-15', excerpt: 'Langkah pertama menulis playbook Ansible untuk provisioning server.', body: 'Konten artikel (placeholder). Nanti tambah syntax highlighting untuk code block.' },
  { slug: 'loki-grafana-setup', title: 'Loki + Grafana untuk Log Aggregation', date: '2024-12-01', excerpt: 'Setup logging terpusat dengan Loki dan Promtail.', body: 'Konten artikel (placeholder).' },
  { slug: 'post-mortem-outage', title: 'Post-Mortem: Brief Outage 2024-Q4', date: '2024-11-20', excerpt: 'Ringkasan insiden dan tindak lanjut.', body: 'Konten artikel (placeholder).' },
]

const route = useRoute()
const post = computed(() => posts.find((p) => p.slug === route.params.slug))
</script>

<template>
  <article v-if="post" class="space-y-6">
    <RouterLink to="/blog" class="text-sm text-neutral-500 dark:text-neutral-400 hover:underline">← Blog</RouterLink>
    <header>
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">{{ post.title }}</h1>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ post.date }}</p>
    </header>
    <div class="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400">
      {{ post.body }}
    </div>
  </article>
  <div v-else class="space-y-4">
    <p class="text-neutral-500 dark:text-neutral-400">Post tidak ditemukan.</p>
    <RouterLink to="/blog" class="text-sm hover:underline">← Kembali ke Blog</RouterLink>
  </div>
</template>
