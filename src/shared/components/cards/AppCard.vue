<template>
  <div
    :class="[
      'border border-slate-200/60 transition-all duration-500 overflow-hidden bg-transparent rounded-none',
      padded ? 'p-12' : '',
      shadow ? 'shadow-premium' : 'shadow-none'
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  padded?: boolean
  shadow?: boolean
}

withDefaults(defineProps<Props>(), {
  padded: false,
  shadow: false
})
</script>
