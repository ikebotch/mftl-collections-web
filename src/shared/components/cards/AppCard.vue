<template>
  <section
    :class="[
      'rounded-2xl bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-hover ring-1 ring-slate-900/5',
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
