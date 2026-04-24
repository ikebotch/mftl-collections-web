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
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
  const width = props.fullWidth ? 'w-full' : ''
  const sizeMap: Record<Size, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  const variantMap: Record<Variant, string> = {
    primary: 'bg-teal-500 text-slate-950 hover:bg-teal-400 focus-visible:ring-teal-500',
    secondary:
      'border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-slate-400',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600',
    soft: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-400',
  }

  return [base, width, sizeMap[props.size], variantMap[props.variant]].join(' ')
})
</script>
