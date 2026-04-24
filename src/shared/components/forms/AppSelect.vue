<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      :class="srOnly ? 'sr-only' : 'block text-sm font-medium text-slate-700'"
    >
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
    <p
      v-if="error"
      :id="`${id}-error`"
      class="text-xs font-medium text-rose-600"
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
