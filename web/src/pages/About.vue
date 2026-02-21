<script setup>
// Phase 2: About — who you are | Phase 3: Certifications badge
const certifications = [
  { name: 'Contoh Sertifikasi', url: null, badge: null },
  // Tambahkan: { name: 'RHCE', url: 'https://...', badge: '/badges/rhce.svg' },
]
</script>

<template>
  <article class="prose prose-neutral dark:prose-invert max-w-none space-y-10">
    <div>
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">About</h1>
      <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
        System Administrator dengan fokus pada infrastruktur Linux, otomasi, dan keamanan.
        Senang mengotomasi hal yang berulang dan menjaga layanan tetap andal.
      </p>
      <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Halaman ini bisa Anda isi dengan ringkasan pengalaman, nilai, dan minat teknis.
      </p>
    </div>
    <!-- Phase 3: Certifications Badge (logo + link validasi) -->
    <section>
      <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">Certifications</h2>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
        Sertifikasi resmi dengan link validasi jika tersedia (RHCE, CCNA, AWS, dll).
      </p>
      <div class="flex flex-wrap gap-4 mt-4">
        <template v-for="c in certifications" :key="c.name">
          <a
            v-if="c.url"
            :href="c.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <img v-if="c.badge" :src="c.badge" :alt="c.name" class="h-8 w-auto" />
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ c.name }}</span>
          </a>
          <span
            v-else
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 text-sm"
          >
            {{ c.name }} (placeholder)
          </span>
        </template>
      </div>
    </section>
  </article>
</template>
