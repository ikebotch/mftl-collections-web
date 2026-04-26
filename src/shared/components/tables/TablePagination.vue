<template>
  <div class="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-white/50">
    <div class="text-xs font-medium text-slate-500">
      Showing
      <span class="font-bold text-slate-900">{{ from }}</span>
      to
      <span class="font-bold text-slate-900">{{ to }}</span>
      of
      <span class="font-bold text-slate-900">{{ total }}</span>
      results
    </div>
    <div class="flex items-center gap-2">
      <button
        type="button"
        :disabled="currentPage === 1"
        class="p-2 rounded-none border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button
        type="button"
        :disabled="currentPage === totalPages"
        class="p-2 rounded-none border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
}>()

defineEmits<{
  'update:currentPage': [page: number]
}>()

const from = computed(() => ((props.currentPage - 1) * props.pageSize) + 1)
const to = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

import { computed } from 'vue'
</script>
