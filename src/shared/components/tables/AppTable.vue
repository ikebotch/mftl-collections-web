<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr class="border-b border-slate-100">
          <th
            v-if="$slots.expansion"
            class="w-12 px-4"
          />
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-50">
        <template
          v-for="(row, rowIndex) in rows"
          :key="row[rowKey] || rowIndex"
        >
          <tr
            class="group hover:bg-slate-50/50 transition-colors duration-300"
            :class="{ 'bg-slate-50/80': expandedRows.has(row[rowKey] || rowIndex) }"
          >
            <td
              v-if="$slots.expansion"
              class="pl-8 py-5"
            >
              <button
                type="button"
                class="p-1 rounded-lg hover:bg-white shadow-sm transition-all duration-300 border border-transparent hover:border-slate-200"
                @click="toggleRow(row[rowKey] || rowIndex)"
              >
                <ChevronRight
                  class="w-4 h-4 text-slate-400 transition-transform duration-300"
                  :class="{ 'rotate-90 text-violet-500': expandedRows.has(row[rowKey] || rowIndex) }"
                />
              </button>
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-8 py-5 text-sm font-medium text-slate-600"
            >
              <slot
                :name="`cell:${column.key}`"
                :value="row[column.key]"
                :row="row"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
          <tr
            v-if="expandedRows.has(row[rowKey] || rowIndex)"
            class="bg-slate-50/30"
          >
            <td
              :colspan="columns.length + ($slots.expansion ? 1 : 0)"
              class="px-8 py-0"
            >
              <div class="pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <slot
                  name="expansion"
                  :row="row"
                />
              </div>
            </td>
          </tr>
        </template>
        <tr v-if="rows.length === 0">
          <td
            :colspan="columns.length + ($slots.expansion ? 1 : 0)"
            class="px-8 py-16 text-center"
          >
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <Inbox class="w-6 h-6" />
              </div>
              <p class="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {{ emptyMessage }}
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight, Inbox } from 'lucide-vue-next'

interface Column {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  rows: any[]
  rowKey?: string
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  emptyMessage: 'No records found',
})

const expandedRows = ref<Set<any>>(new Set())

function toggleRow(key: any) {
  if (expandedRows.value.has(key)) {
    expandedRows.value.delete(key)
  } else {
    expandedRows.value.add(key)
  }
}
</script>
