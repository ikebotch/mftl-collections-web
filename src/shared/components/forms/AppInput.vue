<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      class="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1"
    >
      {{ label }}
    </label>
    <div class="relative group flex items-center">
      <div
        v-if="$slots.icon"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors z-10"
      >
        <slot name="icon" />
      </div>
      
      <div 
        v-if="$slots.prefix"
        class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full bg-transparent border border-slate-200 rounded-none py-3 px-4 text-sm font-black transition-all duration-300 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none"
        :class="[
          $slots.icon ? 'pl-11' : '',
          $slots.prefix ? 'pl-14' : '',
          $slots.suffix ? 'pr-14' : '',
          error ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : '',
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
        ]"
        @input="handleInput"
      >

      <div 
        v-if="$slots.suffix"
        class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
      >
        <slot name="suffix" />
      </div>
    </div>
    <p
      v-if="error"
      class="text-[10px] font-black text-rose-600 ml-1 uppercase tracking-widest italic"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number | null
  label?: string
  placeholder?: string
  type?: string
  id?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
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
