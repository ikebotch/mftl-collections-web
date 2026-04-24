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
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        class="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-900 shadow-sm transition-all duration-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-400 group-hover:border-slate-300"
        @input="onInput"
      >
    </div>
    <p
      v-if="hint && !error"
      :id="`${id}-hint`"
      class="text-xs text-slate-400 mt-1.5 ml-1"
    >
      {{ hint }}
    </p>
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
withDefaults(
  defineProps<{
    id: string
    modelValue: string | number
    label: string
    type?: string
    placeholder?: string
    autocomplete?: string
    hint?: string
    error?: string
    srOnly?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    autocomplete: 'off',
    hint: '',
    error: '',
    srOnly: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
