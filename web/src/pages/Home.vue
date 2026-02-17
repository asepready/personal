<script setup>
// Phase 2: Hero — headline, value proposition
const role = 'Linux System Administrator'
const valueProp = 'Automating Infrastructure & Ensuring Security'
</script>

<template>
  <div class="space-y-16">
    <section class="space-y-6">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
        {{ role }}
      </h1>
      <p class="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl">
        {{ valueProp }}
      </p>
      <div class="flex flex-wrap gap-4">
        <a
          href="/cv.pdf"
          download
          class="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
        >
          Download CV
        </a>
        <RouterLink
          to="/contact"
          class="inline-flex items-center px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Contact
        </RouterLink>
      </div>
    </section>
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-6">
        Quick links
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RouterLink
          to="/skills"
          class="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
        >
          <span class="font-medium">Skills</span>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">OS, Network, Cloud, Automation</p>
        </RouterLink>
        <RouterLink
          to="/projects"
          class="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
        >
          <span class="font-medium">Projects</span>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Case studies & outcomes</p>
        </RouterLink>
        <RouterLink
          to="/status"
          class="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
        >
          <span class="font-medium">Status</span>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Uptime & health</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
