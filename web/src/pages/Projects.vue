<script setup>
// Phase 3: Projects — Masalah -> Solusi -> Tools -> Hasil (quantifiable)
const projects = [
  {
    title: 'Migration to Containerized Apps',
    problem: 'Deploy manual dan environment tidak konsisten.',
    solution: 'CI/CD dengan GitLab + Docker, satu pipeline untuk staging dan production.',
    tools: 'Docker, GitLab CI, Ansible',
    result: 'Deploy time turun dari ~30 menit ke under 5 menit.',
  },
  {
    title: 'Centralized Logging',
    problem: 'Log tersebar di banyak server, sulit investigasi insiden.',
    solution: 'Aggregasi log ke Loki + Grafana, alert on error rate.',
    tools: 'Loki, Promtail, Grafana',
    result: 'Waktu investigasi insiden berkurang ~50%.',
  },
  {
    title: 'High Availability Web Stack',
    problem: 'Single point of failure pada reverse proxy dan app.',
    solution: 'Load balancer + 2 node app, health check dan auto-failover.',
    tools: 'Nginx, Keepalived, systemd',
    result: 'Uptime tercapai 99.9% (SLA).',
  },
]
</script>

<template>
  <div class="space-y-12">
    <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Projects</h1>
    <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
      Studi kasus: masalah → solusi → tools → hasil terukur.
    </p>
    <div class="space-y-8">
      <article
        v-for="(p, i) in projects"
        :key="i"
        class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-4"
      >
        <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">{{ p.title }}</h2>
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
            <dd class="text-neutral-800 dark:text-neutral-200">{{ p.tools }}</dd>
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
