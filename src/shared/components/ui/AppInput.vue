<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label }}
    </label>
    <div class="mt-2">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </div>
    <p
      v-if="error"
      class="mt-2 text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: string
}>()

defineEmits(['update:modelValue'])
</script>
