<template>
  <label 
    class="flex items-center gap-6 p-6 rounded-none border transition-all group cursor-pointer"
    :class="modelValue ? 'border-violet-600 bg-violet-50/20' : 'border-slate-200 bg-transparent hover:border-slate-400'"
  >
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        :checked="modelValue"
        class="peer w-6 h-6 rounded-none border-2 border-slate-200 text-violet-600 focus:ring-violet-500/20 transition-all cursor-pointer"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      >
      <div class="absolute inset-0 bg-violet-600 rounded-none opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <Check class="w-4 h-4 text-white" />
      </div>
    </div>
    <div class="flex-1">
      <p 
        class="text-sm font-black tracking-tight"
        :class="modelValue ? 'text-violet-900' : 'text-slate-900'"
      >
        {{ title }}
      </p>
      <p
        v-if="description"
        class="text-[10px] font-bold uppercase tracking-widest mt-1"
        :class="modelValue ? 'text-violet-600/60' : 'text-slate-400'"
      >{{ description }}</p>
    </div>
  </label>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean
  title: string
  description?: string
}>()

defineEmits(['update:modelValue'])
</script>
