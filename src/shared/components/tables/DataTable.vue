<template>
  <div class="space-y-6">
    <div
      v-if="title || $slots.headerActions"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <h3
        v-if="title"
        class="text-xs font-black uppercase tracking-[0.2em] text-slate-400"
      >
        {{ title }}
      </h3>
      <div class="flex items-center gap-3">
        <slot name="headerActions" />
        <div
          v-if="exportable || printable"
          class="flex items-center gap-2"
        >
          <button
            v-if="exportable"
            class="p-2 text-slate-400 hover:text-violet-600 border border-transparent hover:border-slate-200 transition-all"
            title="Export CSV"
            @click="exportCsv"
          >
            <Download class="w-4 h-4" />
          </button>
          <button
            v-if="printable"
            class="p-2 text-slate-400 hover:text-violet-600 border border-transparent hover:border-slate-200 transition-all"
            title="Print View"
            @click="printTable"
          >
            <Printer class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="bg-transparent border border-slate-200 rounded-none overflow-hidden shadow-sm">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse table-auto">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <!-- Expand spacer -->
              <th
                v-if="expandable"
                class="w-12 px-4 py-3"
              />
              
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
                  :class="[column.headerClass, column.width ? `w-[${column.width}]` : '']"
                  :style="column.width ? { width: column.width, minWidth: column.width } : {}"
                  @sort="$emit('sort', $event)"
                >
                  <template #default>
                    <slot :name="`header:${column.key}`" :column="column" />
                  </template>
                </TableSortHeader>
                <th
                  v-else
                  class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"
                  :class="[column.headerClass, column.width ? `w-[${column.width}]` : '']"
                  :style="column.width ? { width: column.width, minWidth: column.width } : {}"
                >
                  <slot :name="`header:${column.key}`" :column="column">
                    {{ column.label }}
                  </slot>
                </th>
              </template>
              <th
                v-if="$slots.rowActions"
                class="px-6 py-3 text-right w-20"
              />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template
              v-for="(row, index) in displayRows"
              :key="row.id || index"
            >
              <tr
                class="group hover:bg-slate-50/30 transition-all duration-300"
                :class="{ 'bg-violet-50/20': isExpanded(row.id || index) }"
              >
                <!-- Expand trigger -->
                <td
                  v-if="expandable"
                  class="px-4 py-3"
                >
                  <button
                    class="p-1 rounded-full hover:bg-white border border-transparent hover:border-slate-200 text-slate-300 hover:text-violet-600 transition-all"
                    @click="toggleExpand(row.id || index)"
                  >
                    <ChevronRight 
                      class="w-4 h-4 transition-transform duration-500" 
                      :class="{ 'rotate-90 text-violet-600': isExpanded(row.id || index) }" 
                    />
                  </button>
                </td>

                <td
                  v-for="column in columns"
                  :key="column.key"
                  class="px-6 py-4"
                  :class="column.cellClass"
                >
                  <slot
                    :name="`cell:${column.key}`"
                    :row="row"
                    :value="row[column.key]"
                  >
                    <span class="text-sm font-medium text-slate-700 leading-none">{{ row[column.key] }}</span>
                  </slot>
                </td>
                
                <td
                  v-if="$slots.rowActions"
                  class="px-6 py-4 text-right"
                >
                  <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <slot
                      name="rowActions"
                      :row="row"
                    />
                  </div>
                </td>
              </tr>
              
              <!-- Expansion Content -->
              <tr 
                v-if="expandable && isExpanded(row.id || index)"
                class="bg-slate-50/20"
              >
                <td
                  :colspan="columns.length + (expandable ? 1 : 0) + ($slots.rowActions ? 1 : 0)"
                  class="px-10 py-0"
                >
                  <div class="border-l-2 border-violet-500 ml-2">
                    <slot 
                      name="expansion" 
                      :row="row" 
                    />
                  </div>
                </td>
              </tr>
            </template>
            
            <tr v-if="!loading && displayRows.length === 0">
              <td
                :colspan="columns.length + (expandable ? 1 : 0) + ($slots.rowActions ? 1 : 0)"
                class="px-6 py-24 text-center"
              >
                <div class="flex flex-col items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
                    <Inbox class="w-6 h-6" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                      No records found
                    </p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Try adjusting filters or refreshing the sync
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            
            <tr v-if="loading">
              <td
                :colspan="columns.length + (expandable ? 1 : 0) + ($slots.rowActions ? 1 : 0)"
                class="px-6 py-20 text-center"
              >
                <div class="flex flex-col items-center gap-4">
                  <div class="w-8 h-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div 
        v-if="totalPages > 1 || totalItems > 0"
        class="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Showing <span class="text-slate-900 font-black">{{ startRange }}</span> to 
          <span class="text-slate-900 font-black">{{ endRange }}</span> of 
          <span class="text-slate-900 font-black">{{ finalTotalItems }}</span> records
        </div>

        <div class="flex items-center gap-1">
          <button
            class="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 transition-all"
            :disabled="internalPage <= 1"
            @click="setPage(internalPage - 1)"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <div class="flex items-center gap-1 px-2">
            <button
              v-for="p in visiblePages"
              :key="p"
              class="min-w-[32px] h-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              :class="p === internalPage 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'"
              @click="setPage(p)"
            >
              {{ p }}
            </button>
          </div>

          <button
            class="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 transition-all"
            :disabled="internalPage >= totalPages"
            @click="setPage(internalPage + 1)"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronRight, ChevronLeft, Download, Inbox, Printer } from 'lucide-vue-next'
import TableSortHeader from './TableSortHeader.vue'
import { useToastStore } from '@/shared/stores/useToastStore'

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  headerClass?: string
  cellClass?: string
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    rows: any[]
    loading?: boolean
    expandable?: boolean
    exportable?: boolean
    printable?: boolean
    title?: string
    sortKey?: string
    sortOrder?: 'asc' | 'desc'
    pageSize?: number
    page?: number
    totalItems?: number
  }>(),
  {
    loading: false,
    expandable: false,
    exportable: true,
    printable: true,
    title: '',
    sortKey: '',
    sortOrder: 'asc',
    pageSize: 10,
    page: 1,
    totalItems: 0
  }
)

const emit = defineEmits<{
  sort: [key: string]
  retry: []
  'update:page': [page: number]
  'update:pageSize': [size: number]
}>()

const internalPage = ref(props.page)
const expandedRows = ref<Set<string | number>>(new Set())
const toast = useToastStore()

// Sync internal page with prop
watch(() => props.page, (val) => {
  internalPage.value = val
})

const isServerSide = computed(() => props.totalItems > 0)

const finalTotalItems = computed(() => {
  return isServerSide.value ? props.totalItems : props.rows.length
})

const totalPages = computed(() => {
  return Math.ceil(finalTotalItems.value / props.pageSize)
})

const displayRows = computed(() => {
  if (isServerSide.value) return props.rows
  
  const start = (internalPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.rows.slice(start, end)
})

const startRange = computed(() => {
  if (finalTotalItems.value === 0) return 0
  return (internalPage.value - 1) * props.pageSize + 1
})

const endRange = computed(() => {
  return Math.min(internalPage.value * props.pageSize, finalTotalItems.value)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, internalPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function setPage(p: number) {
  internalPage.value = p
  emit('update:page', p)
}

function toggleExpand(id: string | number) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}

function isExpanded(id: string | number) {
  return expandedRows.value.has(id)
}

function exportCsv() {
  if (props.rows.length === 0) {
    toast.error('No data available to export')
    return
  }

  const headers = props.columns.map(c => c.label).join(',')
  const dataRows = props.rows.map(row => 
    props.columns.map(c => {
      const val = row[c.key]
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    }).join(',')
  ).join('\n')

  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${dataRows}`
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${props.title || 'export'}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toast.success('Records exported successfully')
}

function printTable() {
  window.print()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

@media print {
  .no-print, 
  button, 
  .sm\:flex-row,
  .header-actions {
    display: none !important;
  }
  
  .bg-white {
    border: none !important;
    box-shadow: none !important;
  }
  
  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }
  
  th, td {
    border: 1px solid #e2e8f0 !important;
    padding: 8px !important;
  }
  
  .text-slate-400 {
    color: #64748b !important;
  }
}
</style>
