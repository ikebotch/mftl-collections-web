<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Self donations"
      description="Monitor placeholder history for contributions made directly on behalf of the contributor."
    />
    <SelfDonationHistory :rows="query.data.value ?? []" />
  </div>
</template>

<script setup lang="ts">
import { useSelfDonations } from '../composables/useSelfDonations'
import SelfDonationHistory from '../components/SelfDonationHistory.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const query = useSelfDonations()
</script>
