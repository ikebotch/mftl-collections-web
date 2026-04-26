<template>
  <th
    class="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] cursor-pointer hover:text-slate-900 transition-colors"
    @click="$emit('sort', columnKey)"
  >
    <div class="flex items-center gap-2">
      <div class="flex flex-col">
        <slot>
          {{ label }}
        </slot>
      </div>
      <div class="flex flex-col -space-y-1">
        <ChevronUp
          class="w-3 h-3 transition-colors"
          :class="sortKey === columnKey && sortOrder === 'asc' ? 'text-violet-600' : 'text-slate-300'"
        />
        <ChevronDown
          class="w-3 h-3 transition-colors"
          :class="sortKey === columnKey && sortOrder === 'desc' ? 'text-violet-600' : 'text-slate-300'"
        />
      </div>
    </div>
  </th>
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next'

defineProps<{
  label: string
  columnKey: string
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
}>()

defineEmits<{
  sort: [key: string]
}>()
</script>
