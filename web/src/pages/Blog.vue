<script setup>
// Phase 3: Blog — artikel teknis; nanti tambah syntax highlighting (highlight.js/shiki)
const posts = [
  { slug: 'ansible-first-playbook', title: 'Ansible: First Playbook', date: '2025-01-15', excerpt: 'Langkah pertama menulis playbook Ansible untuk provisioning server.' },
  { slug: 'loki-grafana-setup', title: 'Loki + Grafana untuk Log Aggregation', date: '2024-12-01', excerpt: 'Setup logging terpusat dengan Loki dan Promtail.' },
  { slug: 'post-mortem-outage', title: 'Post-Mortem: Brief Outage 2024-Q4', date: '2024-11-20', excerpt: 'Ringkasan insiden dan tindak lanjut.' },
]
</script>

<template>
  <div class="space-y-12">
    <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Blog / Write-ups</h1>
    <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
      Tutorial, troubleshooting, dan post-mortem. Code snippet akan memakai syntax highlighting.
    </p>
    <ul class="space-y-6">
      <li
        v-for="post in posts"
        :key="post.slug"
        class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
      >
        <router-link :to="`/blog/${post.slug}`" class="block">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-white hover:underline">
            {{ post.title }}
          </h2>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ post.date }}</p>
          <p class="text-neutral-600 dark:text-neutral-400 mt-2">{{ post.excerpt }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>
