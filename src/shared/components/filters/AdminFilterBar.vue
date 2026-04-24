<template>
  <div class="flex flex-col md:flex-row items-center gap-4">
    <div class="flex-1 relative w-full">
      <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-white focus:border-slate-900 focus:ring-0 transition-all text-sm font-bold placeholder:text-slate-300 shadow-sm"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </div>
    <slot name="extra" />
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineProps<{
  modelValue: string
  placeholder?: string
}>()

defineEmits(['update:modelValue'])
</script>
