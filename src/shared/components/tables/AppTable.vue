<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr class="border-b border-slate-100">
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-50">
        <tr
          v-for="(row, rowIndex) in rows"
          :key="row[rowKey] || rowIndex"
          class="group hover:bg-slate-50/50 transition-colors duration-300"
        >
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
        <tr v-if="rows.length === 0">
          <td
            :colspan="columns.length"
            class="px-8 py-16 text-center"
          >
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <Inbox class="w-6 h-6" />
              </div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
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
import { Inbox } from 'lucide-vue-next'

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
</script>
