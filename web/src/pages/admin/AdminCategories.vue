<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useApiBase } from '../../composables/useApi'

const auth = useAuth()
const { adminCategoriesUrl } = useApiBase()

const categories = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const formOpen = ref(false)
const editing = ref(null)
const saving = ref(false)
const deleteConfirm = ref(null) // { id, name } or null

const formTitle = computed(() => (editing.value ? 'Edit kategori' : 'Tambah kategori'))
const deleteConfirmName = computed(() => deleteConfirm.value?.name ?? '')

function getAuthHeaders() {
  const t = auth.getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

function showSuccess(msg) {
  successMessage.value = msg
  error.value = ''
}

function showError(msg) {
  error.value = msg
  successMessage.value = ''
}

watch(successMessage, (v) => {
  if (v) {
    const t = setTimeout(() => { successMessage.value = '' }, 4000)
    return () => clearTimeout(t)
  }
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const r = await fetch(adminCategoriesUrl(), { headers: getAuthHeaders() })
    if (r.status === 401) {
      auth.logout()
      window.location.href = '/login'
      return
    }
    if (!r.ok) throw new Error('Gagal memuat')
    const data = await r.json()
    categories.value = data.categories || []
  } catch (e) {
    showError(e.message || 'Koneksi gagal')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(cat) {
  editing.value = { id: cat.id, name: cat.name, slug: cat.slug, sort_order: cat.sort_order }
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editing.value = null
}

async function submitForm(payload) {
  saving.value = true
  showError('')
  try {
    const url = adminCategoriesUrl()
    const method = payload.id ? 'PUT' : 'POST'
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    })
    if (r.status === 401) {
      auth.logout()
      window.location.href = '/login'
      return
    }
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(data.error || 'Gagal menyimpan')
    closeForm()
    await load()
    showSuccess(payload.id ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambah.')
  } catch (e) {
    showError(e.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  if (!deleteConfirm.value) return
  const id = deleteConfirm.value.id
  saving.value = true
  showError('')
  try {
    const r = await fetch(`${adminCategoriesUrl()}?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (r.status === 401) {
      auth.logout()
      window.location.href = '/login'
      return
    }
    if (!r.ok) {
      const data = await r.json().catch(() => ({}))
      throw new Error(data.error || 'Gagal menghapus')
    }
    deleteConfirm.value = null
    await load()
    showSuccess('Kategori berhasil dihapus.')
  } catch (e) {
    showError(e.message || 'Gagal menghapus')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">Kategori Skill</h2>
      <button
        type="button"
        @click="openCreate"
        class="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        + Tambah kategori
      </button>
    </div>
    <p v-if="successMessage" class="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
      {{ successMessage }}
    </p>
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{{ error }}</p>
    <div v-if="loading" class="py-8 text-neutral-500 dark:text-neutral-400">Memuat…</div>
    <div v-else class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30">
      <table class="w-full text-sm">
        <thead class="bg-neutral-100 dark:bg-neutral-800/50">
          <tr>
            <th class="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">ID</th>
            <th class="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Nama</th>
            <th class="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Slug</th>
            <th class="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Urutan</th>
            <th class="w-28 py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <tr
            v-for="(cat, i) in categories"
            :key="cat.id"
            class="text-neutral-600 dark:text-neutral-400"
            :class="i % 2 === 1 ? 'bg-neutral-50/50 dark:bg-neutral-800/20' : ''"
          >
            <td class="py-3 px-4">{{ cat.id }}</td>
            <td class="py-3 px-4 font-medium text-neutral-800 dark:text-neutral-200">{{ cat.name }}</td>
            <td class="py-3 px-4 font-mono text-xs">{{ cat.slug }}</td>
            <td class="py-3 px-4">{{ cat.sort_order }}</td>
            <td class="py-3 px-4 text-right">
              <button type="button" @click="openEdit(cat)" class="text-blue-600 dark:text-blue-400 hover:underline mr-3">Edit</button>
              <button type="button" @click="deleteConfirm = { id: cat.id, name: cat.name }" class="text-red-600 dark:text-red-400 hover:underline">Hapus</button>
            </td>
          </tr>
          <tr v-if="!categories.length">
            <td colspan="5" class="py-10 px-4 text-center text-neutral-500 dark:text-neutral-400">
              Belum ada kategori. Klik &quot;Tambah kategori&quot; untuk menambah.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form modal -->
    <div v-if="formOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="closeForm">
      <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{{ formTitle }}</h3>
        <form
          @submit.prevent="
            (e) => {
              const fd = new FormData(e.target)
              submitForm({
                id: editing?.id,
                name: fd.get('name'),
                slug: fd.get('slug'),
                sort_order: parseInt(fd.get('sort_order') || '0', 10),
              })
            }
          "
          class="space-y-4"
        >
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nama</label>
            <input
              type="text"
              name="name"
              :value="editing?.name"
              required
              class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
              placeholder="Contoh: Automation"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              :value="editing?.slug"
              required
              class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
              placeholder="automation"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Urutan (sort_order)</label>
            <input
              type="number"
              name="sort_order"
              :value="editing?.sort_order ?? 0"
              min="0"
              class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>
          <div class="flex gap-2 pt-2">
            <button type="submit" :disabled="saving" class="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium disabled:opacity-50">
              {{ saving ? 'Menyimpan…' : 'Simpan' }}
            </button>
            <button type="button" @click="closeForm" class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="deleteConfirm = null">
      <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-sm w-full p-6 border border-neutral-200 dark:border-neutral-700">
        <p class="text-neutral-700 dark:text-neutral-300 mb-2">
          Hapus kategori <strong>{{ deleteConfirmName }}</strong>?
        </p>
        <p class="text-sm text-amber-600 dark:text-amber-400 mb-4">Semua skill di kategori ini ikut terhapus (CASCADE).</p>
        <div class="flex gap-2">
          <button type="button" @click="doDelete" :disabled="saving" class="px-4 py-2 rounded-lg bg-red-600 text-white font-medium disabled:opacity-50 hover:bg-red-700">
            Ya, hapus
          </button>
          <button type="button" @click="deleteConfirm = null" class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>
