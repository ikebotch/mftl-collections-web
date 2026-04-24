<template>
  <div class="font-mono font-bold text-slate-900">
    {{ formatCurrency(amount, currency) }}
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/shared/utils/formatters'

defineProps<{
  amount: number
  currency?: string
}>()
</script>
