<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <button
      v-for="method in methods"
      :key="method.id"
      class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group"
      :class="[
        modelValue === method.id 
          ? 'border-[#7C3AED] bg-white shadow-lg shadow-violet-500/5' 
          : 'border-slate-50 bg-white hover:border-violet-100 hover:shadow-sm'
      ]"
      @click="$emit('update:modelValue', method.id)"
    >
      <div 
        v-if="modelValue === method.id"
        class="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#7C3AED] border-2 border-white shadow-sm"
      />
      
      <div
        class="h-10 flex items-center justify-center mb-3 grayscale group-hover:grayscale-0 transition-all"
        :class="{ 'grayscale-0': modelValue === method.id }"
      >
        <component
          :is="method.icon"
          class="w-8 h-8"
          :class="modelValue === method.id ? 'text-[#7C3AED]' : 'text-slate-300'"
        />
      </div>
      
      <span class="text-[10px] font-black uppercase tracking-widest text-[#0F172A] text-center leading-tight">
        {{ method.label }}
      </span>
      <p class="text-[8px] font-bold text-slate-400 uppercase mt-1 text-center whitespace-nowrap">
        {{ method.subtext }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { 
  Banknote, 
  Smartphone, 
  CreditCard, 
  Building2 
} from 'lucide-vue-next'

defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])

const methods = [
  { id: 'cash', label: 'Cash', subtext: 'Pay collector', icon: Banknote },
  { id: 'momo', label: 'Mobile Money', subtext: 'Pay with MoMo', icon: Smartphone },
  { id: 'card', label: 'Visa / Card', subtext: 'Pay securely', icon: CreditCard },
  { id: 'bank', label: 'Bank Transfer', subtext: 'Transfer directly', icon: Building2 }
]
</script>
