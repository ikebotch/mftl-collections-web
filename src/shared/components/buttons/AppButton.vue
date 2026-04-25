<template>
  <button
    :type="buttonType"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-black transition-all duration-300 focus:outline-none focus:ring-4 active:scale-[0.98] uppercase tracking-[0.15em]',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:saturate-50',
      sizeClasses,
      variantClasses,
      rounded ? 'rounded-full' : 'rounded-none'
    ]"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <div
      v-if="loading"
      class="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white' | 'action'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  nativeType?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  rounded?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  nativeType: undefined,
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
    xs: 'px-3 py-1.5 text-[9px]',
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-3.5 text-[11px]',
    lg: 'px-10 py-4 text-xs',
  }
  return sizes[props.size]
})

const buttonType = computed(() => props.nativeType ?? props.type)

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-violet-600 text-white shadow-xl shadow-violet-600/20 hover:bg-violet-700 hover:translate-y-[-1px] focus:ring-violet-500/20',
    secondary: 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-100',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-100',
    danger: 'bg-rose-600 text-white shadow-xl shadow-rose-600/20 hover:bg-rose-700 focus:ring-rose-500/20',
    outline: 'bg-transparent border border-slate-200 text-slate-500 hover:border-violet-600 hover:text-violet-600 focus:ring-violet-500/10',
    white: 'bg-white text-slate-900 shadow-premium hover:bg-slate-50 focus:ring-slate-200',
    action: 'bg-slate-900 text-white hover:bg-black focus:ring-slate-900/10'
  }
  return variants[props.variant]
})
</script>
