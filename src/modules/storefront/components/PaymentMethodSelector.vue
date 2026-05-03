<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div
      v-for="method in availableMethods"
      :key="method.id"
      class="relative"
    >
      <button
        type="button"
        class="w-full relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group"
        :class="[
          modelValue === method.id 
            ? 'border-[#7C3AED] bg-white shadow-lg shadow-violet-500/5' 
            : method.disabled
              ? 'border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed'
              : 'border-slate-50 bg-white hover:border-violet-100 hover:shadow-sm'
        ]"
        :disabled="method.disabled"
        @click="!method.disabled && $emit('update:modelValue', method.id)"
      >
        <div 
          v-if="modelValue === method.id"
          class="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#7C3AED] border-2 border-white shadow-sm"
        />
        
        <div
          class="h-10 flex items-center justify-center mb-3 transition-all"
          :class="[
            modelValue === method.id || !method.disabled ? 'grayscale-0' : 'grayscale'
          ]"
        >
          <component
            :is="method.icon"
            class="w-8 h-8"
            :class="[
              modelValue === method.id 
                ? 'text-[#7C3AED]' 
                : method.disabled ? 'text-slate-200' : 'text-slate-300'
            ]"
          />
        </div>
        
        <span class="text-[10px] font-black uppercase tracking-widest text-[#0F172A] text-center leading-tight">
          {{ method.label }}
        </span>
        <p class="text-[8px] font-bold text-slate-400 uppercase mt-1 text-center whitespace-nowrap">
          {{ method.disabled ? method.disabledMessage : method.subtext }}
        </p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Smartphone, 
  CreditCard, 
  Building2 
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  currency: string
}>()

defineEmits(['update:modelValue'])

const availableMethods = computed(() => [
  { 
    id: 'momo', 
    label: 'Mobile Money', 
    subtext: 'Pay with MoMo', 
    icon: Smartphone,
    disabled: props.currency !== 'GHS',
    disabledMessage: 'Available for GHS'
  },
  { 
    id: 'card', 
    label: 'Visa / Card', 
    subtext: 'Pay securely', 
    icon: CreditCard,
    disabled: false
  },
  { 
    id: 'bank', 
    label: 'Bank Payment', 
    subtext: 'Secure bank via GC', 
    icon: Building2,
    disabled: props.currency === 'GHS',
    disabledMessage: 'For GBP/EUR only'
  }
])
</script>
