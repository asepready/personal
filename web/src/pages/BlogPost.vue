<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'

const posts = [
  {
    slug: 'ansible-first-playbook',
    title: 'Ansible: First Playbook',
    date: '2025-01-15',
    excerpt: 'Langkah pertama menulis playbook Ansible untuk provisioning server.',
    body: `<p>Langkah pertama menulis playbook Ansible untuk provisioning server.</p><p>Contoh playbook:</p><pre><code class="language-yaml">- name: Install nginx
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
    excerpt: 'Setup logging terpusat dengan Loki dan Promtail.',
    body: `<p>Setup logging terpusat dengan Loki dan Promtail. Contoh konfig Promtail:</p><pre><code class="language-yaml">server:
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
    excerpt: 'Ringkasan insiden dan tindak lanjut.',
    body: '<p>Ringkasan insiden dan tindak lanjut. Root cause: misconfiguration. Tindak lanjut: runbook diperbarui, alert ditambah.</p>',
  },
]

const route = useRoute()
const post = computed(() => posts.find((p) => p.slug === route.params.slug))
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
</script>

<template>
  <article v-if="post" class="space-y-6">
    <RouterLink to="/blog" class="text-sm text-neutral-500 dark:text-neutral-400 hover:underline">← Blog</RouterLink>
    <header>
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">{{ post.title }}</h1>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ post.date }}</p>
    </header>
    <!-- Phase 3: Code syntax highlighting (highlight.js) -->
    <div
      ref="bodyRef"
      class="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
      v-html="post.body"
    />
  </article>
  <div v-else class="space-y-4">
    <p class="text-neutral-500 dark:text-neutral-400">Post tidak ditemukan.</p>
    <RouterLink to="/blog" class="text-sm hover:underline">← Kembali ke Blog</RouterLink>
  </div>
</template>
