<script setup>
// Phase 3: Skills — kategori + level (tanpa progress bar)
const categories = [
  { name: 'OS', level: 'Expert', items: ['Alpine', 'Debian', 'CentOS', 'RHEL'] },
  { name: 'Network', level: 'Advanced', items: ['TCP/IP', 'DNS', 'Firewall', 'VPN'] },
  { name: 'Cloud', level: 'Advanced', items: ['AWS', 'Terraform', 'Docker', 'Kubernetes'] },
  { name: 'Automation', level: 'Expert', items: ['Ansible', 'Bash', 'Python', 'CI/CD'] },
  { name: 'Monitoring', level: 'Advanced', items: ['Prometheus', 'Grafana', 'Uptime Kuma', 'Loki'] },
]
</script>

<template>
  <div class="space-y-12">
    <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Skills</h1>
    <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
      Tech stack dikelompokkan per kategori. Level: Fundamental, Advanced, Expert.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section
        v-for="cat in categories"
        :key="cat.name"
        class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">{{ cat.name }}</h2>
          <span class="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {{ cat.level }}
          </span>
        </div>
        <ul class="space-y-2 text-neutral-600 dark:text-neutral-400">
          <li v-for="item in cat.items" :key="item" class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
            {{ item }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
