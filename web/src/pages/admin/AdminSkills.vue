<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useApiBase } from '../../composables/useApi'

const auth = useAuth()
const { adminSkillsUrl, adminCategoriesUrl } = useApiBase()

const skills = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const formOpen = ref(false)
const editing = ref(null)
const formCategoryId = ref('') // untuk v-model select
const saving = ref(false)
const deleteConfirm = ref(null) // { id, name } or null

const formTitle = computed(() => (editing.value ? 'Edit skill' : 'Tambah skill'))
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

async function loadCategories() {
  try {
    const r = await fetch(adminCategoriesUrl(), { headers: getAuthHeaders() })
    if (r.ok) {
      const data = await r.json()
      categories.value = data.categories || []
    }
  } catch (_) {}
}

async function load() {
  loading.value = true
  showError('')
  try {
    const r = await fetch(adminSkillsUrl(), { headers: getAuthHeaders() })
    if (r.status === 401) {
      auth.logout()
      window.location.href = '/login'
      return
    }
    if (!r.ok) throw new Error('Gagal memuat')
    const data = await r.json()
    skills.value = data.skills || []
  } catch (e) {
    showError(e.message || 'Koneksi gagal')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  formCategoryId.value = categories.value[0] ? String(categories.value[0].id) : ''
  formOpen.value = true
}

function openEdit(skill) {
  editing.value = {
    id: skill.id,
    category_id: skill.category_id,
    name: skill.name,
    level: skill.level,
    icon_url: skill.icon_url ?? '',
  }
  formCategoryId.value = String(skill.category_id)
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editing.value = null
}

async function submitForm(payload) {
  saving.value = true
  showError('')
  const body = {
    category_id: payload.category_id,
    name: payload.name,
    level: payload.level,
    icon_url: payload.icon_url || null,
  }
  if (payload.icon_url === '') body.icon_url = null
  try {
    const url = adminSkillsUrl()
    if (payload.id) {
      body.id = payload.id
      const r = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(body),
      })
      if (r.status === 401) {
        auth.logout()
        window.location.href = '/login'
        return
      }
      const data = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(data.error || 'Gagal menyimpan')
    } else {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(body),
      })
      if (r.status === 401) {
        auth.logout()
        window.location.href = '/login'
        return
      }
      const data = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(data.error || 'Gagal menyimpan')
    }
    closeForm()
    await load()
    showSuccess(payload.id ? 'Skill berhasil diperbarui.' : 'Skill berhasil ditambah.')
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
    const r = await fetch(`${adminSkillsUrl()}?id=${id}`, {
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
    showSuccess('Skill berhasil dihapus.')
  } catch (e) {
    showError(e.message || 'Gagal menghapus')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  await load()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">Skills</h2>
      <button
        type="button"
        @click="openCreate"
        :disabled="!categories.length"
        class="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        :title="!categories.length ? 'Buat kategori dulu' : ''"
      >
        + Tambah skill
      </button>
    </div>
    <p v-if="!categories.length && !loading" class="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
      Buat minimal satu <router-link to="/admin/categories" class="underline">Kategori Skill</router-link> dulu, lalu tambah skill.
    </p>
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
            <th class="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Kategori</th>
            <th class="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Nama</th>
            <th class="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Level</th>
            <th class="w-28 py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <tr
            v-for="(s, i) in skills"
            :key="s.id"
            class="text-neutral-600 dark:text-neutral-400"
            :class="i % 2 === 1 ? 'bg-neutral-50/50 dark:bg-neutral-800/20' : ''"
          >
            <td class="py-3 px-4">{{ s.id }}</td>
            <td class="py-3 px-4">{{ s.category || '—' }}</td>
            <td class="py-3 px-4 font-medium text-neutral-800 dark:text-neutral-200">{{ s.name }}</td>
            <td class="py-3 px-4">{{ s.level }}</td>
            <td class="py-3 px-4 text-right">
              <button type="button" @click="openEdit(s)" class="text-blue-600 dark:text-blue-400 hover:underline mr-3">Edit</button>
              <button type="button" @click="deleteConfirm = { id: s.id, name: s.name }" class="text-red-600 dark:text-red-400 hover:underline">Hapus</button>
            </td>
          </tr>
          <tr v-if="!skills.length && categories.length">
            <td colspan="5" class="py-10 px-4 text-center text-neutral-500 dark:text-neutral-400">
              Belum ada skill. Klik &quot;Tambah skill&quot; untuk menambah.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form modal -->
    <div v-if="formOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="closeForm">
      <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{{ formTitle }}</h3>
        <form
          @submit.prevent="
            (e) => {
              const fd = new FormData(e.target)
              submitForm({
                id: editing?.id,
                category_id: parseInt(formCategoryId || '0', 10),
                name: fd.get('name'),
                level: fd.get('level'),
                icon_url: fd.get('icon_url') || null,
              })
            }
          "
          class="space-y-4"
        >
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Kategori</label>
            <select
              v-model="formCategoryId"
              required
              class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
            >
              <option value="">— Pilih kategori —</option>
              <option v-for="c in categories" :key="c.id" :value="String(c.id)">
                {{ c.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nama</label>
            <input
              type="text"
              name="name"
              :value="editing?.name"
              required
              class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
              placeholder="Contoh: Ansible"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Level</label>
            <select
              name="level"
              required
              class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
            >
              <option value="Fundamental" :selected="editing?.level === 'Fundamental'">Fundamental</option>
              <option value="Advanced" :selected="editing?.level === 'Advanced'">Advanced</option>
              <option value="Expert" :selected="editing?.level === 'Expert'">Expert</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Icon URL (opsional)</label>
            <input
              type="url"
              name="icon_url"
              :value="editing?.icon_url"
              class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:outline-none"
              placeholder="https://..."
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
        <p class="text-neutral-700 dark:text-neutral-300 mb-4">Hapus skill <strong>{{ deleteConfirmName }}</strong>?</p>
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
