<template>
  <AppBadge :tone="status === 'active' ? 'success' : 'warning'">
    {{ label }}
  </AppBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from '@/shared/components/badges/AppBadge.vue'

const props = defineProps<{
  status: 'active' | 'draft'
}>()

const label = computed(() => (props.status === 'active' ? 'Active' : 'Draft'))
</script>
