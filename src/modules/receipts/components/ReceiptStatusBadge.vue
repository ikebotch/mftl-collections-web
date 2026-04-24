<template>
  <AppBadge :tone="tone">
    {{ status }}
  </AppBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from '@/shared/components/badges/AppBadge.vue'

const props = defineProps<{
  status: string
}>()

const tone = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'issued':
      return 'success'
    case 'voided':
      return 'danger'
    default:
      return 'warning'
  }
})
</script>
