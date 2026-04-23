<template>
  <div class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
    <div
      v-if="$slots.header"
      class="border-b border-gray-100 bg-gray-50/50 px-6 py-4"
    >
      <slot name="header" />
    </div>
    <div :class="['px-6 py-5', bodyClass]">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="border-t border-gray-100 bg-gray-50/50 px-6 py-4"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  bodyClass: { type: String, default: '' },
})
</script>
