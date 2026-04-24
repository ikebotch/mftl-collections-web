<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Tenant settings"
      description="Review profile, branding, and payment configuration placeholders for the active tenant."
    />

    <div class="grid gap-4 lg:grid-cols-3">
      <AppCard>
        <SectionHeader
          title="Tenant profile"
          :description="query.data.value?.profile ?? 'Loading profile…'"
        />
      </AppCard>
      <AppCard>
        <SectionHeader
          title="Branding"
          :description="query.data.value?.branding ?? 'Loading branding…'"
        />
      </AppCard>
      <AppCard>
        <SectionHeader
          title="Payment provider"
          :description="query.data.value?.payments ?? 'Loading payment provider…'"
        />
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTenantSettings } from '../composables/useTenantSettings'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'

const query = useTenantSettings()
</script>
