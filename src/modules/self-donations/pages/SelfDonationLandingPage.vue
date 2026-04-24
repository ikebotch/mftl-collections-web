<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Self contribution"
      title="Contribute for yourself"
      description="This route keeps the self-donation entry point distinct from donating to a recipient fund."
    />
    <AppCard>
      <p class="text-sm text-slate-500">
        Use this flow when the contributor is paying directly for their own obligation or ticket.
      </p>
      <div class="mt-6">
        <AppButton @click="router.push(`/contribute/${eventSlug}/recipient`)">
          Continue to standard flow
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
</script>
