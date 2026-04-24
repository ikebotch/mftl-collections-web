<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      :class="srOnly ? 'sr-only' : 'block text-[11px] font-bold text-slate-600 uppercase tracking-[0.15em] ml-1'"
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
      class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 placeholder:text-slate-500 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
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
