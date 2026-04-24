<template>
  <section
    :class="[
      'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60',
      padded ? '' : 'p-0',
    ]"
  >
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean
  }>(),
  {
    padded: true,
  },
)
</script>
