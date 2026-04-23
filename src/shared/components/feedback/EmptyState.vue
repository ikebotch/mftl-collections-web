<template>
  <div class="text-center bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 px-6 py-14">
    <div
      v-if="icon"
      class="mx-auto h-12 w-12 text-gray-400"
    >
      <component
        :is="icon"
        class="h-12 w-12"
      />
    </div>
    <h3 class="mt-2 text-sm font-semibold text-gray-900">
      {{ title }}
    </h3>
    <p class="mt-1 text-sm text-gray-500">
      {{ description }}
    </p>
    <div
      v-if="$slots.action"
      class="mt-6"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: any
}>()
</script>
