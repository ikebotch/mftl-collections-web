<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-xl font-semibold text-slate-950">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="text-sm text-slate-500"
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
