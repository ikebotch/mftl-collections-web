<template>
  <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <caption
          v-if="caption"
          class="sr-only"
        >
          {{ caption }}
        </caption>
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr
            v-for="row in rows"
            :key="getRowKey(row)"
            class="hover:bg-slate-50/80"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-4 text-sm text-slate-700"
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
              class="px-4 py-12 text-center text-sm text-slate-500"
            >
              {{ emptyMessage }}
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
