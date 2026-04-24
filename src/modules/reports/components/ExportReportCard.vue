<template>
  <AppCard>
    <SectionHeader
      title="Export CSV"
      description="CSV generation is stubbed until the reporting endpoint is connected."
    />
    <div class="mt-6">
      <AppButton variant="secondary">
        Export CSV
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
</script>
