<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
    <div class="flex-1 max-w-md">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          :value="search"
          :placeholder="searchPlaceholder"
          class="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        >
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <slot />
      <button
        v-if="showClear"
        type="button"
        class="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors"
        @click="$emit('clear')"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

withDefaults(defineProps<{
  search?: string
  searchPlaceholder?: string
  showClear?: boolean
}>(), {
  search: '',
  searchPlaceholder: 'Search...',
  showClear: false
})

defineEmits<{
  'update:search': [value: string]
  clear: []
}>()
</script>
