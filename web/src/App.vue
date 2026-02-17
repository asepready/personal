<script setup>
import { ref } from 'vue'

const role = ref('Linux System Administrator')
const valueProp = ref('Automating Infrastructure & Ensuring Security')
const skills = ref([
  { category: 'OS', items: ['Alpine', 'Debian', 'CentOS'] },
  { category: 'Automation', items: ['Ansible', 'Terraform', 'Bash'] },
  { category: 'Monitoring', items: ['Prometheus', 'Grafana', 'Uptime Kuma'] }
])
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-8">
    <header class="max-w-4xl mx-auto mb-16">
      <nav class="flex justify-between items-center mb-12">
        <h1 class="text-xl font-bold tracking-tighter">SYSADMIN.LOG</h1>
        <div class="space-x-4 text-sm text-neutral-400">
          <a href="#" class="hover:text-white transition-colors">Home</a>
          <a href="#" class="hover:text-white transition-colors">Projects</a>
          <a href="#" class="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>
      
      <div class="space-y-4">
        <h2 class="text-5xl font-extrabold tracking-tight">{{ role }}</h2>
        <p class="text-xl text-neutral-400 max-w-2xl">{{ valueProp }}</p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto space-y-16">
      <section>
        <h3 class="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-8">Technical Proficiency</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="skill in skills" :key="skill.category" class="space-y-2">
            <h4 class="text-lg font-medium">{{ skill.category }}</h4>
            <ul class="text-sm text-neutral-400 space-y-1">
              <li v-for="item in skill.items" :key="item" class="flex items-center">
                <span class="w-1 h-1 bg-neutral-600 rounded-full mr-2"></span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="border-t border-neutral-800 pt-16">
        <div class="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
          <p class="text-sm font-mono text-neutral-400 mb-2">// Server Status</p>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-lg font-mono">Infrastructure UP</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
/* Base styles are handled by Tailwind */
</style>
