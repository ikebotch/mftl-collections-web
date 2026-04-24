<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      :class="srOnly ? 'sr-only' : 'block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1'"
    >
      {{ label }}
    </label>
    <div class="relative group">
      <select
        :id="id"
        :value="modelValue"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-900 shadow-sm appearance-none transition-all duration-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 group-hover:border-slate-300 cursor-pointer"
        @change="onChange"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-brand-500 transition-colors">
        ↓
      </div>
    </div>
    <p
      v-if="error"
      :id="`${id}-error`"
      class="text-xs font-bold text-rose-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
export interface SelectOption {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    id: string
    modelValue: string
    label: string
    options: SelectOption[]
    error?: string
    srOnly?: boolean
  }>(),
  {
    error: '',
    srOnly: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>
