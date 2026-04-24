<template>
  <div class="overflow-hidden rounded-2xl bg-white shadow-premium ring-1 ring-slate-900/5">
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <caption
          v-if="caption"
          class="sr-only"
        >
          {{ caption }}
        </caption>
        <thead>
          <tr class="border-b border-slate-100">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-slate-50/50"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="row in rows"
            :key="getRowKey(row)"
            class="group hover:bg-brand-50/30 transition-colors duration-200"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 text-sm text-slate-600 transition-colors duration-200 group-hover:text-slate-900"
            >
              <slot
                :name="`cell:${column.key}`"
                :row="row"
                :value="getCellValue(row, column.key)"
              >
                {{ getCellValue(row, column.key) }}
              </slot>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td
              :colspan="columns.length"
              class="px-6 py-16 text-center"
            >
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                  📭
                </div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {{ emptyMessage }}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    rows: unknown[]
    caption?: string
    emptyMessage?: string
    rowKey?: string
  }>(),
  {
    caption: '',
    emptyMessage: 'No records available.',
    rowKey: '',
  },
)

function getCellValue(row: unknown, key: string): unknown {
  if (row && typeof row === 'object') {
    return (row as Record<string, unknown>)[key]
  }

  return undefined
}

function getRowKey(row: unknown): string {
  if (!props.rowKey || !row || typeof row !== 'object') {
    return JSON.stringify(row)
  }

  return String((row as Record<string, unknown>)[props.rowKey] ?? JSON.stringify(row))
}
</script>
