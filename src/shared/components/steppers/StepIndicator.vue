<template>
  <div class="flex items-center justify-between w-full max-w-3xl mx-auto mb-12">
    <div 
      v-for="(step, index) in steps" 
      :key="index"
      class="flex flex-col items-center relative flex-1"
    >
      <!-- Connector Line -->
      <div 
        v-if="index < steps.length - 1"
        class="absolute top-5 left-[50%] right-[-50%] h-0.5 bg-slate-100 z-0"
      >
        <div 
          class="h-full bg-violet-600 transition-all duration-500"
          :style="{ width: index + 1 <= currentStep ? '100%' : '0%' }"
        />
      </div>

      <!-- Step Circle -->
      <div 
        class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-500 border-2"
        :class="[
          index + 1 === currentStep ? 'bg-violet-600 text-white border-violet-600 shadow-premium' :
          index + 1 < currentStep ? 'bg-white text-violet-600 border-violet-600' :
          'bg-white text-slate-400 border-slate-100'
        ]"
      >
        <Check v-if="index + 1 < currentStep" class="w-5 h-5" />
        <span v-else>{{ index + 1 }}</span>
      </div>

      <!-- Step Label -->
      <span 
        class="mt-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 text-center px-2"
        :class="index + 1 <= currentStep ? 'text-slate-900' : 'text-slate-400'"
      >
        {{ step }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'

defineProps<{
  steps: string[]
  currentStep: number
}>()
</script>
