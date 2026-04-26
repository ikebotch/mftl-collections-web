<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white p-4 border border-slate-200">
      <div class="flex-1 max-w-md flex items-center gap-2">
        <div class="relative flex-1 group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <input
            type="text"
            :value="modelValue"
            :placeholder="placeholder"
            class="w-full pl-11 pr-4 py-2.5 bg-transparent border border-slate-100 rounded-none text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none uppercase tracking-widest"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          >
        </div>
        
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2.5 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap"
          :class="isExpanded ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-200'"
          @click="isExpanded = !isExpanded"
        >
          <Filter class="w-3.5 h-3.5" />
          {{ isExpanded ? 'Hide Filters' : 'More Filters' }}
        </button>
      </div>
      
      <div class="flex items-center gap-4">
        <slot name="actions" />
        <button
          v-if="showClear"
          type="button"
          class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 transition-colors italic px-2"
          @click="$emit('clear')"
        >
          Clear All
        </button>
      </div>
    </div>

    <!-- Expandable Filter Sections -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div 
        v-if="isExpanded" 
        class="bg-white border border-slate-200 p-8 grid grid-cols-1 md:grid-cols-4 gap-12"
      >
        <slot name="sections" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Filter } from 'lucide-vue-next'

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

const isExpanded = ref(false)
</script>
