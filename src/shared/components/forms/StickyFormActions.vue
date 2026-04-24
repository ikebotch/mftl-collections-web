<template>
  <div class="sticky bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 mt-12 -mx-4 md:-mx-8 lg:-mx-12">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
      <div>
        <slot name="left" />
      </div>
      <div class="flex items-center gap-3">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Container for form actions that sticks to the bottom
</script>
