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
        <div v-if="exportable" class="flex items-center gap-2">
          <button
            class="p-2 text-slate-400 hover:text-violet-600 border border-transparent hover:border-slate-200 transition-all"
            title="Export CSV"
            @click="exportCsv"
          >
            <Download class="w-4 h-4" />
          </button>
          <button
            class="p-2 text-slate-400 hover:text-violet-600 border border-transparent hover:border-slate-200 transition-all"
            title="Print View"
            @click="printTable"
          >
            <Printer class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse table-auto">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <!-- Expand spacer -->
              <th v-if="expandable" class="w-12 px-4 py-4" />
              
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
                />
                <th
                  v-else
                  class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"
                  :class="[column.headerClass, column.width ? `w-[${column.width}]` : '']"
                  :style="column.width ? { width: column.width, minWidth: column.width } : {}"
                >
                  {{ column.label }}
                </th>
              </template>
              <th v-if="$slots.rowActions" class="px-6 py-4 text-right w-20" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template
              v-for="(row, index) in rows"
              :key="row.id || index"
            >
              <tr
                class="group hover:bg-slate-50/30 transition-all duration-300"
                :class="{ 'bg-violet-50/20': isExpanded(row.id || index) }"
              >
                <!-- Expand trigger -->
                <td v-if="expandable" class="px-4 py-4">
                  <button
                    class="p-1 rounded-none hover:bg-white border border-transparent hover:border-slate-200 text-slate-300 hover:text-violet-600 transition-all"
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
                    <span class="text-sm font-medium text-slate-700">{{ row[column.key] }}</span>
                  </slot>
                </td>
                
                <td
                  v-if="$slots.rowActions"
                  class="px-6 py-4 text-right"
                >
                  <slot
                    name="rowActions"
                    :row="row"
                  />
                </td>
              </tr>
              
              <!-- Expansion Content -->
              <tr 
                v-if="expandable && isExpanded(row.id || index)"
                class="bg-slate-50/20"
              >
                <td :colspan="columns.length + (expandable ? 1 : 0) + ($slots.rowActions ? 1 : 0)" class="px-10 py-0">
                  <div class="border-l-2 border-violet-500 ml-2">
                    <slot 
                      name="expansion" 
                      :row="row" 
                    />
                  </div>
                </td>
              </tr>
            </template>
            
            <tr v-if="!loading && rows.length === 0">
              <td
                :colspan="columns.length + (expandable ? 1 : 0) + ($slots.rowActions ? 1 : 0)"
                class="px-6 py-24 text-center"
              >
                <div class="flex flex-col items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Inbox class="w-6 h-6 text-slate-300" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-black text-slate-900 uppercase tracking-tight">No data available</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adjust your filters or try refreshing</p>
                  </div>
                  <AppButton 
                    variant="ghost" 
                    size="sm" 
                    class="mt-2 text-[10px] font-black uppercase tracking-widest border border-slate-200"
                    @click="$emit('retry')"
                  >
                    Sync Data
                  </AppButton>
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
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Retrieving Records...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight, Download, Inbox, Printer } from 'lucide-vue-next'
import TableSortHeader from './TableSortHeader.vue'
import AppButton from '../buttons/AppButton.vue'
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
    title?: string
    sortKey?: string
    sortOrder?: 'asc' | 'desc'
  }>(),
  {
    loading: false,
    expandable: false,
    exportable: false,
    title: '',
    sortKey: '',
    sortOrder: 'asc'
  }
)

const emit = defineEmits<{
  sort: [key: string]
  retry: []
}>()

const expandedRows = ref<Set<string | number>>(new Set())
const toast = useToastStore()

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
</style>
