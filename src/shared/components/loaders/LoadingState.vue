<template>
  <div class="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-10 text-center">
    <div
      class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500"
      aria-hidden="true"
    />
    <p class="text-sm font-medium text-slate-600">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'Loading…',
  },
)
</script>
