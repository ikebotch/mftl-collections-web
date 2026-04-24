<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      class="block text-[11px] font-bold text-slate-600 uppercase tracking-[0.15em] ml-1"
    >
      {{ label }}
    </label>
    <div class="relative group">
      <div
        v-if="$slots.icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
      >
        <slot name="icon" />
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium transition-all duration-300 placeholder:text-slate-500 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none',
          $slots.icon ? 'pl-11' : '',
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
        ]"
        @input="handleInput"
      >
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
interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  id?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
  disabled: false,
  required: false,
  label: '',
  placeholder: '',
  error: '',
})

const emit = defineEmits(['update:modelValue'])

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
