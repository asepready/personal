<script setup>
// Phase 6: 404 custom — gaya pesan error Cisco/Linux
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center font-mono">
    <p class="text-neutral-500 dark:text-neutral-400 text-sm mb-2">% hostname: connection refused</p>
    <h1 class="text-4xl sm:text-6xl font-bold text-red-600 dark:text-red-400 tracking-tighter">
      Error 404: Route Not Found
    </h1>
    <p class="mt-4 text-neutral-600 dark:text-neutral-400 max-w-md">
      No route to host. Check the URL or go back to the homepage.
    </p>
    <router-link
      to="/"
      class="mt-8 inline-flex items-center px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
    >
      → Home
    </router-link>
  </div>
</template>
