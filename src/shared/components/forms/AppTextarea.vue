<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      :class="srOnly ? 'sr-only' : 'block text-sm font-medium text-slate-700'"
    >
      {{ label }}
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      @input="onInput"
    />
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
withDefaults(
  defineProps<{
    id: string
    modelValue: string
    label: string
    rows?: number
    placeholder?: string
    error?: string
    srOnly?: boolean
  }>(),
  {
    rows: 4,
    placeholder: '',
    error: '',
    srOnly: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>
