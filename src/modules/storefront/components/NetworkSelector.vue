<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="network in networks"
      :key="network.id"
      class="relative flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all duration-300 group"
      :class="[
        modelValue === network.id 
          ? 'border-[#7C3AED] bg-white shadow-lg shadow-violet-500/5' 
          : 'border-slate-50 bg-white hover:border-violet-100'
      ]"
      @click="$emit('update:modelValue', network.id)"
    >
      <div 
        class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
        :class="modelValue === network.id ? 'border-[#7C3AED] bg-[#7C3AED]' : 'border-slate-200 bg-white'"
      >
        <div
          v-if="modelValue === network.id"
          class="w-1 h-1 rounded-full bg-white"
        />
      </div>
      
      <div class="flex items-center gap-1.5 min-w-0">
        <div
          class="w-6 h-6 rounded bg-slate-50 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all flex-shrink-0"
          :class="{ 'grayscale-0': modelValue === network.id }"
        >
          <span class="text-[7px] font-black uppercase text-slate-400">{{ network.id.slice(0, 3) }}</span>
        </div>
        <span class="text-[9px] font-black uppercase tracking-tight text-[#0F172A] truncate">
          {{ network.label }}
        </span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])

const networks = [
  { id: 'mtn', label: 'MTN MoMo' },
  { id: 'vodafone', label: 'Vodafone' },
  { id: 'airteltigo', label: 'AirtelTigo' }
]
</script>
