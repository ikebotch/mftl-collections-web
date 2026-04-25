<template>
  <div class="relative w-full">
    <!-- Loading State Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
        <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Loading data...</span>
      </div>
    </div>

    <!-- Optional Header Area -->
    <div
      v-if="title || $slots.actions || exportable"
      class="flex items-center justify-between mb-6 px-1"
    >
      <div>
        <h3
          v-if="title"
          class="text-xs font-black uppercase tracking-[0.2em] text-slate-400"
        >
          {{ title }}
        </h3>
      </div>
      <div class="flex items-center gap-3">
        <slot name="actions" />
        <AppButton 
          v-if="exportable && rows.length > 0"
          variant="outline" 
          size="xs" 
          class="!rounded-lg text-[9px] font-black uppercase tracking-widest bg-white border-slate-200"
          @click="exportToCsv"
        >
          <Download class="w-3.5 h-3.5 mr-2 text-slate-400" />
          Export CSV
        </AppButton>
      </div>
    </div>

    <!-- Responsive Container -->
    <div class="w-full overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/50">
      <table class="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/50">
            <template
              v-for="column in columns"
              :key="column.key"
            >
              <TableSortHeader
                v-if="column.sortable"
                :label="column.label"
                :column-key="column.key"
                :sort-key="sortKey"
                :sort-order="sortOrder"
                @sort="$emit('sort', $event)"
              />
              <th
                v-else
                class="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]"
                :class="column.headerClass"
              >
                {{ column.label }}
              </th>
            </template>
            <th
              v-if="$slots.rowActions"
              class="sticky right-0 px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] bg-slate-50/50 backdrop-blur text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-slate-50">
          <!-- Error State -->
          <tr v-if="error">
            <td
              :colspan="columns.length + ($slots.rowActions ? 1 : 0)"
              class="px-8 py-16 text-center"
            >
              <div class="flex flex-col items-center gap-2">
                <AlertCircle class="w-8 h-8 text-red-500 mb-2" />
                <p class="text-sm font-bold text-slate-900">
                  Failed to load data
                </p>
                <p class="text-xs text-slate-500">
                  {{ error }}
                </p>
                <button 
                  type="button" 
                  class="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-600 hover:text-violet-700"
                  @click="$emit('retry')"
                >
                  Try Again
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="rows.length === 0 && !loading">
            <td
              :colspan="columns.length + ($slots.rowActions ? 1 : 0)"
              class="px-8 py-16 text-center"
            >
              <slot name="empty">
                <div class="flex flex-col items-center">
                  <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                    <Inbox class="w-6 h-6" />
                  </div>
                  <p class="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    {{ emptyMessage }}
                  </p>
                </div>
              </slot>
            </td>
          </tr>

          <!-- Data Rows -->
          <template v-else>
            <template
              v-for="(row, rowIndex) in rows"
              :key="row[rowKey] || rowIndex"
            >
              <tr
                class="group hover:bg-slate-50/50 transition-all duration-300"
                :class="{ 'bg-slate-50/30': expandedRows.has(row[rowKey]) }"
              >
                <td
                  v-for="column in columns"
                  :key="column.key"
                  class="px-8 py-5 text-sm font-medium text-slate-600"
                  :class="column.cellClass"
                >
                  <div class="flex items-center gap-3">
                    <button
                      v-if="expandable && column.key === columns[0].key"
                      type="button"
                      class="p-1 rounded-lg hover:bg-slate-200 transition-colors"
                      @click="toggleExpand(row[rowKey])"
                    >
                      <ChevronRight 
                        class="w-4 h-4 transition-transform duration-300"
                        :class="{ 'rotate-90': expandedRows.has(row[rowKey]) }"
                      />
                    </button>
                    <slot
                      :name="`cell:${column.key}`"
                      :value="row[column.key]"
                      :row="row"
                    >
                      {{ row[column.key] }}
                    </slot>
                  </div>
                </td>
                <td
                  v-if="$slots.rowActions"
                  class="sticky right-0 px-8 py-5 bg-white/80 group-hover:bg-slate-50/80 backdrop-blur transition-colors text-right border-l border-slate-50"
                >
                  <slot
                    name="rowActions"
                    :row="row"
                  />
                </td>
              </tr>

              <!-- Expansion Row -->
              <tr 
                v-if="expandable && expandedRows.has(row[rowKey])"
                class="bg-slate-50/30"
              >
                <td 
                  :colspan="columns.length + ($slots.rowActions ? 1 : 0)"
                  class="px-8 py-0"
                >
                  <div class="pb-8 pt-2 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <slot 
                      name="expansion" 
                      :row="row" 
                    />
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>

      <!-- Pagination -->
      <TablePagination
        v-if="pagination && total > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        :page-size="pageSize"
        @update:current-page="$emit('update:currentPage', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Inbox, AlertCircle, ChevronRight, Download } from 'lucide-vue-next'
import TableSortHeader from './TableSortHeader.vue'
import TablePagination from './TablePagination.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  headerClass?: string
  cellClass?: string
}

interface Props {
  columns: Column[]
  rows: any[]
  rowKey?: string
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  expandable?: boolean
  title?: string
  exportable?: boolean
  // Pagination
  pagination?: boolean
  currentPage?: number
  totalPages?: number
  total?: number
  pageSize?: number
  // Sorting
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  loading: false,
  error: null,
  emptyMessage: 'No records found',
  expandable: false,
  title: '',
  exportable: false,
  pagination: false,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  pageSize: 10,
  sortKey: '',
  sortOrder: 'asc'
})

defineEmits<{
  sort: [key: string]
  'update:currentPage': [page: number]
  retry: []
}>()

const expandedRows = ref<Set<any>>(new Set())

function toggleExpand(id: any) {
  if (expandedRows.value.has(id)) {
    const next = new Set(expandedRows.value)
    next.delete(id)
    expandedRows.value = next
  } else {
    const next = new Set(expandedRows.value)
    next.add(id)
    expandedRows.value = next
  }
}

function exportToCsv() {
  if (!props.rows.length) return

  const headers = props.columns.map(c => c.label).join(',')
  const lines = props.rows.map(row => {
    return props.columns.map(col => {
      const val = row[col.key]
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    }).join(',')
  })

  const csvContent = [headers, ...lines].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${props.title || 'export'}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
/* Ensure sticky columns don't bleed background */
.sticky {
  z-index: 1;
}
</style>
