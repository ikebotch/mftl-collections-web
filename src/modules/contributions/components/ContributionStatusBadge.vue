<template>
  <AppBadge tone="success">
    {{ status }}
  </AppBadge>
</template>

<script setup lang="ts">
import AppBadge from '@/shared/components/badges/AppBadge.vue'

defineProps<{
  status: string
}>()
</script>
