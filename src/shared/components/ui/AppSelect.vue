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
      <select
        :id="id"
        :value="modelValue"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
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
export interface SelectOption {
  value: string | number
  label: string
}

defineProps<{
  id: string
  modelValue: string | number
  options: SelectOption[]
  label?: string
  disabled?: boolean
  error?: string
}>()

defineEmits(['update:modelValue'])
</script>
