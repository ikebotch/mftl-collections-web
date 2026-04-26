<template>
  <div
    :class="[
      'border border-slate-200/60 transition-all duration-500 overflow-hidden bg-transparent',
      padded ? 'p-12' : '',
      rounded === '3xl' ? 'rounded-[2.5rem]' : (rounded === '2xl' ? 'rounded-[1.5rem]' : 'rounded-none'),
      shadow ? 'shadow-premium' : 'shadow-none'
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  padded?: boolean
  rounded?: 'none' | '2xl' | '3xl'
  shadow?: boolean
}

withDefaults(defineProps<Props>(), {
  padded: false,
  rounded: 'none',
  shadow: false
})
</script>
