<template>
  <MetricCard
    :label="label"
    :value="value"
    :hint="hint"
  />
</template>

<script setup lang="ts">
import MetricCard from '@/shared/components/cards/MetricCard.vue'

defineProps<{
  label: string
  value: string
  hint: string
}>()
</script>
