<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-4 active:scale-[0.98]',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:saturate-50',
      sizeClasses,
      variantClasses,
      rounded ? 'rounded-full' : 'rounded-[1.25rem]'
    ]"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <div
      v-if="loading"
      class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  rounded?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  rounded: false,
  ariaLabel: '',
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-3 py-1.5 text-[10px] uppercase tracking-widest',
    sm: 'px-4 py-2 text-xs uppercase tracking-widest',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 hover:shadow-violet-600/30 focus:ring-violet-500/20',
    secondary: 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 focus:ring-red-500/20',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-600 hover:border-violet-500 hover:text-violet-600 focus:ring-violet-500/10',
    white: 'bg-white text-slate-900 shadow-premium hover:bg-slate-50 focus:ring-slate-200',
  }
  return variants[props.variant]
})
</script>
