<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useApiBase } from '../../composables/useApi'

const route = useRoute()
const auth = useAuth()
const { adminResourceUrl, adminResourcesUrl } = useApiBase()

const resourceId = computed(() => route.params.resource || '')
const schema = ref(null)
const list = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const formOpen = ref(false)
const editing = ref(null)
const saving = ref(false)
const deleteConfirm = ref(null)
const relationOptions = ref({}) // { 'skill-categories': [...], 'tools': [...] }

const LIST_KEYS = {
  'skill-categories': 'categories',
  'skills': 'skills',
  'tools': 'tools',
  'tags': 'tags',
  'projects': 'projects',
  'posts': 'posts',
}

const resourceSchema = computed(() => {
  if (!schema.value || !resourceId.value) return null
  return schema.value.find((r) => r.id === resourceId.value) || null
})

const formTitle = computed(() => (editing.value ? `Edit ${resourceSchema.value?.label || ''}` : `Tambah ${resourceSchema.value?.label || ''}`))
const displayKey = computed(() => resourceSchema.value?.display_key || 'name')

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

async function loadSchema() {
  try {
    const r = await fetch(adminResourcesUrl(), { headers: getAuthHeaders() })
    if (r.status === 401) {
      auth.logout()
      window.location.href = '/login'
      return
    }
    if (!r.ok) return
    const data = await r.json()
    schema.value = data.resources || []
  } catch (_) {}
}

async function loadRelationOptions(relationId) {
  if (relationOptions.value[relationId]) return
  try {
    const url = adminResourceUrl(relationId)
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) return
    const data = await res.json()
    const key = LIST_KEYS[relationId]
    const arr = data[key] || []
    relationOptions.value[relationId] = arr
  } catch (_) {}
}

async function load() {
  if (!resourceId.value) return
  loading.value = true
  error.value = ''
  try {
    const url = adminResourceUrl(resourceId.value)
    const r = await fetch(url, { headers: getAuthHeaders() })
    if (r.status === 401) {
      auth.logout()
      window.location.href = '/login'
      return
    }
    if (!r.ok) throw new Error('Gagal memuat')
    const data = await r.json()
    const key = LIST_KEYS[resourceId.value]
    list.value = data[key] != null ? data[key] : []
  } catch (e) {
    showError(e.message || 'Koneksi gagal')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  const initial = {}
  for (const f of resourceSchema.value?.form_fields || []) {
    if (f.type === 'number') initial[f.key] = 0
    else if (f.type === 'boolean') initial[f.key] = false
    else if (f.type === 'multiselect') initial[f.key] = []
    else initial[f.key] = ''
  }
  editing.value = initial
  formOpen.value = true
}

function openEdit(row) {
  editing.value = { ...row }
  if (row.tool_ids) editing.value.tool_ids = (row.tool_ids || []).map((x) => (typeof x === 'number' ? x : parseInt(x, 10)))
  if (row.tag_ids) editing.value.tag_ids = (row.tag_ids || []).map((x) => (typeof x === 'number' ? x : parseInt(x, 10)))
  if (row.published_at && typeof row.published_at === 'string') {
    editing.value.published_at = row.published_at.slice(0, 10)
  }
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editing.value = null
}

function cellValue(row, key) {
  const v = row[key]
  if (v === true) return 'Ya'
  if (v === false) return 'Tidak'
  if (v === null || v === undefined) return '—'
  return String(v)
}

async function submitForm(payload) {
  saving.value = true
  showError('')
  const url = adminResourceUrl(resourceId.value)
  const method = payload.id ? 'PUT' : 'POST'
  const body = { ...payload }
  if (body.sort_order === '' || body.sort_order === undefined) body.sort_order = 0
  if (body.icon_url === '') body.icon_url = null
  if (body.logo_url === '') body.logo_url = null
  if (body.diagram_url === '') body.diagram_url = null
  for (const f of resourceSchema.value?.form_fields || []) {
    if (f.type === 'select' && f.relation && body[f.key] !== undefined && body[f.key] !== '') {
      body[f.key] = parseInt(body[f.key], 10) || 0
    }
    if (f.type === 'multiselect' && Array.isArray(body[f.key])) {
      body[f.key] = body[f.key].map((x) => (typeof x === 'number' ? x : parseInt(x, 10))).filter((n) => !isNaN(n))
    }
  }
  try {
    const r = await fetch(url, {
      method,
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
    closeForm()
    await load()
    showSuccess(payload.id ? 'Berhasil diperbarui.' : 'Berhasil ditambah.')
  } catch (e) {
    showError(e.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(row) {
  deleteConfirm.value = { id: row[resourceSchema.value?.primary_key || 'id'], name: row[displayKey.value] }
}

function cancelDelete() {
  deleteConfirm.value = null
}

async function doDelete() {
  if (!deleteConfirm.value) return
  const id = deleteConfirm.value.id
  const url = `${adminResourceUrl(resourceId.value)}?id=${id}`
  try {
    const r = await fetch(url, { method: 'DELETE', headers: getAuthHeaders() })
    if (r.status === 401) {
      auth.logout()
      window.location.href = '/login'
      return
    }
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(data.error || 'Gagal menghapus')
    cancelDelete()
    await load()
    showSuccess('Berhasil dihapus.')
  } catch (e) {
    showError(e.message || 'Gagal menghapus')
  }
}

onMounted(async () => {
  await loadSchema()
  if (resourceSchema.value) {
    for (const f of resourceSchema.value.form_fields || []) {
      if (f.relation) await loadRelationOptions(f.relation)
    }
  }
  await load()
})
watch(resourceId, () => { loadSchema().then(load) })
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">
      {{ resourceSchema?.label || resourceId }}
    </h2>

    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    <p v-if="successMessage" class="text-sm text-green-600 dark:text-green-400">{{ successMessage }}</p>

    <div v-if="loading" class="text-neutral-500 dark:text-neutral-400">Memuat…</div>

    <template v-else-if="resourceSchema">
      <div class="flex justify-end mb-4">
        <button
          type="button"
          @click="openCreate"
          class="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90"
        >
          Tambah
        </button>
      </div>

      <div class="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table class="min-w-full text-sm">
          <thead class="bg-neutral-100 dark:bg-neutral-800/50">
            <tr>
              <th
                v-for="col in resourceSchema.list_fields"
                :key="col.key"
                class="px-4 py-3 text-left font-medium text-neutral-700 dark:text-neutral-300"
              >
                {{ col.label }}
              </th>
              <th class="px-4 py-3 text-right font-medium text-neutral-700 dark:text-neutral-300">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
            <tr
              v-for="row in list"
              :key="row[resourceSchema.primary_key]"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
            >
              <td
                v-for="col in resourceSchema.list_fields"
                :key="col.key"
                class="px-4 py-3 text-neutral-700 dark:text-neutral-300"
              >
                {{ cellValue(row, col.key) }}
              </td>
              <td class="px-4 py-3 text-right space-x-2">
                <button
                  type="button"
                  @click="openEdit(row)"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  @click="confirmDelete(row)"
                  class="text-red-600 dark:text-red-400 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal form -->
      <div
        v-if="formOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="closeForm"
      >
        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{{ formTitle }}</h3>
            <form
              @submit.prevent="submitForm(editing)"
              class="space-y-4"
            >
              <template v-for="f in resourceSchema.form_fields" :key="f.key">
                <div v-if="f.type === 'string' || f.type === 'url'" class="space-y-1">
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ f.label }}</label>
                  <input
                    v-model="editing[f.key]"
                    type="text"
                    :required="f.required"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div v-else-if="f.type === 'text'" class="space-y-1">
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ f.label }}</label>
                  <textarea
                    v-model="editing[f.key]"
                    rows="4"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div v-else-if="f.type === 'number'" class="space-y-1">
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ f.label }}</label>
                  <input
                    v-model.number="editing[f.key]"
                    type="number"
                    :required="f.required"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div v-else-if="f.type === 'boolean'" class="flex items-center gap-2">
                  <input
                    :id="'f-' + f.key"
                    v-model="editing[f.key]"
                    type="checkbox"
                    class="rounded border-neutral-300 dark:border-neutral-600"
                  />
                  <label :for="'f-' + f.key" class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ f.label }}</label>
                </div>
                <div v-else-if="f.type === 'date'" class="space-y-1">
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ f.label }}</label>
                  <input
                    v-model="editing[f.key]"
                    type="date"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div v-else-if="f.type === 'select'" class="space-y-1">
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ f.label }}</label>
                  <select
                    v-model="editing[f.key]"
                    :required="f.required"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="">— Pilih —</option>
                    <option
                      v-for="opt in (f.relation ? relationOptions[f.relation] : f.options) || []"
                      :key="opt.id ?? opt.value"
                      :value="String(opt.id ?? opt.value)"
                    >
                      {{ opt.name ?? opt.label }}
                    </option>
                  </select>
                </div>
                <div v-else-if="f.type === 'multiselect'" class="space-y-1">
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ f.label }}</label>
                  <select
                    multiple
                    v-model="editing[f.key]"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white min-h-[100px]"
                  >
                    <option
                      v-for="opt in (f.relation ? relationOptions[f.relation] : f.options) || []"
                      :key="opt.id ?? opt.value"
                      :value="Number(opt.id ?? opt.value)"
                    >
                      {{ opt.name ?? opt.label }}
                    </option>
                  </select>
                  <p class="text-xs text-neutral-500">Tahan Ctrl/Cmd untuk pilih banyak</p>
                </div>
              </template>
              <div class="flex gap-2 pt-4">
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium disabled:opacity-50"
                >
                  {{ saving ? 'Menyimpan…' : 'Simpan' }}
                </button>
                <button
                  type="button"
                  @click="closeForm"
                  class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Delete confirm -->
      <div
        v-if="deleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="cancelDelete"
      >
        <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-sm w-full p-6">
          <p class="text-neutral-700 dark:text-neutral-300">
            Hapus <strong>{{ deleteConfirm.name }}</strong>?
          </p>
          <div class="flex gap-2 mt-4">
            <button
              type="button"
              @click="doDelete"
              class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium"
            >
              Ya, hapus
            </button>
            <button
              type="button"
              @click="cancelDelete"
              class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </template>

    <p v-else class="text-neutral-500 dark:text-neutral-400">Resource tidak ditemukan.</p>
  </div>
</template>
