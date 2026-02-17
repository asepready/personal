<script setup>
// Phase 4: Kontak aman — mailto atau Formspree; opsional PGP/GPG
const email = 'you@example.com'
const pgpUrl = '/pgp.asc' // link ke public key
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">Contact</h1>
    <p class="text-neutral-600 dark:text-neutral-400 max-w-2xl">
      Hindari form PHP yang rawan spam. Gunakan <strong>mailto:</strong> atau layanan form statis (Formspree/Netlify Forms).
      Untuk enkripsi email, sertakan link ke PGP public key.
    </p>
    <div class="flex flex-wrap gap-4">
      <a
        :href="`mailto:${email}`"
        class="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
      >
        Email (mailto)
      </a>
      <a
        v-if="pgpUrl"
        :href="pgpUrl"
        class="inline-flex items-center px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        PGP Public Key
      </a>
    </div>
    <section class="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
        PGP fingerprint (contoh)
      </h2>
      <code class="text-sm text-neutral-700 dark:text-neutral-300 break-all">
        ABCD 1234 EF56 7890 ...
      </code>
    </section>
  </div>
</template>
