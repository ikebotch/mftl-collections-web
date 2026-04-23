<template>
  <div class="flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(row, i) in data"
              :key="i"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"
              >
                <slot
                  :name="`cell(${column.key})`"
                  :row="row"
                  :value="row[column.key]"
                >
                  {{ row[column.key] }}
                </slot>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td
                :colspan="columns.length"
                class="py-10 text-center text-sm text-gray-400"
              >
                No data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
}

defineProps<{
  columns: TableColumn[]
  data: any[]
}>()
</script>
