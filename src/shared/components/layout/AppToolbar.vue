<template>
  <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
    <div class="flex flex-1 items-center">
      <slot name="start" />
    </div>
    <div class="flex items-center gap-x-4">
      <slot name="end" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
