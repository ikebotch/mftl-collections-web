<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      class="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1"
    >
      {{ label }}
    </label>
    <div class="relative group">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 pr-10 text-sm font-medium appearance-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none cursor-pointer"
        @change="handleChange"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
        >
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
        <ChevronDown class="w-4 h-4" />
      </div>
    </div>
    <p
      v-if="error"
      class="text-[10px] font-bold text-red-600 ml-1 uppercase tracking-widest"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

export interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  id: () => `select-${Math.random().toString(36).substr(2, 9)}`,
  disabled: false,
  required: false,
  label: '',
  placeholder: '',
  error: '',
})

const emit = defineEmits(['update:modelValue'])

function handleChange(e: Event) {
  const target = e.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
