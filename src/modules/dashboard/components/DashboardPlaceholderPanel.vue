<template>
  <AppCard>
    <SectionHeader
      :title="title"
      :description="description"
    />
    <div class="mt-5 rounded-none border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
      {{ body }}
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/shared/components/cards/AppCard.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'

defineProps<{
  title: string
  description: string
  body: string
}>()
</script>
