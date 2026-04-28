<template>
  <button 
    class="relative flex flex-col p-5 rounded-[24px] border-2 transition-all duration-300 text-left group"
    :class="[
      selected 
        ? 'border-[#7C3AED] bg-white shadow-xl shadow-violet-500/5' 
        : 'border-slate-100 bg-white hover:border-violet-100 hover:shadow-lg'
    ]"
    @click="$emit('select')"
  >
    <!-- Selection Indicator -->
    <div 
      v-if="selected"
      class="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center text-white"
    >
      <Check class="w-3 h-3 stroke-[4]" />
    </div>

    <!-- Icon -->
    <div 
      class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
      :class="selected ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'bg-slate-50 text-slate-400'"
    >
      <component
        :is="icon || Heart"
        class="w-5 h-5"
      />
    </div>

    <h4 class="text-[13px] font-black text-[#0F172A] leading-tight mb-1 uppercase tracking-tight">
      {{ title }}
    </h4>
    <p class="text-[11px] font-medium text-slate-400 line-clamp-2 leading-relaxed">
      {{ description }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { Check, Heart } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  title: string
  description: string
  selected?: boolean
  icon?: Component
}>()

defineEmits(['select'])
</script>
