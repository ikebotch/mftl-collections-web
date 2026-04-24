<template>
  <div
    :class="[
      'bg-white border border-slate-100/50 shadow-soft transition-all duration-500',
      padded ? 'p-8' : '',
      rounded === '3xl' ? 'rounded-[2rem]' : 'rounded-[1.5rem]'
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  padded?: boolean
  rounded?: '2xl' | '3xl'
}

withDefaults(defineProps<Props>(), {
  padded: false,
  rounded: '2xl',
})
</script>
