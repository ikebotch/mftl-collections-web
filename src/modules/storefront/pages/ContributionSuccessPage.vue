<template>
  <AppCard class="mx-auto max-w-2xl text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
      Contribution complete
    </p>
    <h1 class="mt-3 text-3xl font-semibold text-slate-950">
      Thank you for supporting this collection
    </h1>
    <p class="mt-4 text-sm text-slate-500">
      Receipt generation is still a placeholder, but the success flow and handoff state are in place.
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <AppButton @click="router.push(`/give/${eventSlug}`)">
        Contribute again
      </AppButton>
      <AppButton variant="secondary">
        Receipt placeholder
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'

const route = useRoute()
const router = useRouter()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
</script>
