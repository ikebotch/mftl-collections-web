<template>
  <div class="flex flex-col gap-1">
    <h2 class="text-xl font-bold text-slate-900 font-display">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="text-sm text-slate-400 font-medium"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  {
    description: '',
  },
)
</script>
