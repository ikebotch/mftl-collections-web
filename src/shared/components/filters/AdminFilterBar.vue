<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-8 bg-slate-50/10 p-5 rounded-none border border-slate-200">
    <div class="flex-1 max-w-md">
      <div class="relative group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
        <input
          type="text"
          :value="modelValue"
          :placeholder="placeholder"
          class="w-full pl-11 pr-4 py-2.5 bg-transparent border border-slate-200 rounded-none text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <slot name="extra" />
      <slot />
      <button
        v-if="showClear"
        type="button"
        class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 transition-colors italic"
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
  modelValue?: string
  placeholder?: string
  showClear?: boolean
}>(), {
  modelValue: '',
  placeholder: 'Search...',
  showClear: false
})

defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()
</script>
