<template>
  <component
    :is="tag"
    :type="tag === 'button' ? nativeType : undefined"
    :class="classes"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
    ariaLabel?: string
    tag?: 'button' | 'span'
    nativeType?: 'button' | 'submit' | 'reset'
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    ariaLabel: '',
    tag: 'button',
    nativeType: 'button',
    fullWidth: false,
  },
)

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-display active:scale-95'
  const width = props.fullWidth ? 'w-full' : ''
  const sizeMap: Record<Size, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }
  const variantMap: Record<Variant, string> = {
    primary: 'bg-brand-600 text-white shadow-premium hover:bg-brand-700 hover:shadow-premium-hover focus-visible:ring-brand-500',
    secondary:
      'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500',
    danger: 'bg-rose-500 text-white shadow-premium hover:bg-rose-600 focus-visible:ring-rose-500',
    soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100 focus-visible:ring-brand-500',
  }

  return [base, width, sizeMap[props.size], variantMap[props.variant]].join(' ')
})
</script>
