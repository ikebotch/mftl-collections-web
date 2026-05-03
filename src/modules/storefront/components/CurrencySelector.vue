<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="curr in currencies"
      :key="curr.id"
      type="button"
      class="px-4 py-2 rounded-xl border-2 transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
      :class="[
        modelValue === curr.id
          ? 'border-[#7C3AED] bg-white text-[#7C3AED] shadow-md'
          : 'border-slate-50 bg-white text-slate-400 hover:border-violet-100 hover:text-slate-500'
      ]"
      @click="$emit('update:modelValue', curr.id)"
    >
      {{ curr.id }} ({{ curr.symbol }})
    </button>
  </div>
</template>

<script setup lang="ts">
const currencies = [
  { id: 'GHS', symbol: 'GH₵' },
  { id: 'GBP', symbol: '£' },
  { id: 'EUR', symbol: '€' }
]

defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>
