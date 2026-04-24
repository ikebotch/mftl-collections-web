<template>
  <section class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
    <AppCard class="overflow-hidden bg-slate-950 text-white">
      <div class="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.45),_transparent_45%),radial-gradient(circle_at_right,_rgba(34,211,238,0.35),_transparent_35%)] p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
          Support this event
        </p>
        <h2 class="mt-3 text-4xl font-semibold leading-tight">
          {{ eventQuery.data.value?.title }}
        </h2>
        <p class="mt-4 max-w-2xl text-base text-slate-200">
          {{ eventQuery.data.value?.description }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <AppButton
            size="lg"
            @click="router.push(`/contribute/${eventSlug}/recipient`)"
          >
            Start contribution
          </AppButton>
          <AppButton
            size="lg"
            variant="secondary"
            @click="router.push(`/contribute/${eventSlug}/self`)"
          >
            I am contributing for myself
          </AppButton>
        </div>
      </div>
    </AppCard>

    <div class="space-y-4">
      <AppCard>
        <SectionHeader
          title="Why donors can trust this flow"
          :description="eventQuery.data.value?.trustNote ?? ''"
        />
        <ul class="mt-4 space-y-3 text-sm text-slate-600">
          <li>Secure payment options with a clear confirmation step.</li>
          <li>Transparent fund selection before payment.</li>
          <li>Receipt and follow-up placeholders ready for production wiring.</li>
        </ul>
      </AppCard>
      <AppCard>
        <SectionHeader
          title="Choose how to contribute"
          description="Mobile-first flow with card, mobile money, and in-person options."
        />
      </AppCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStorefrontEvent } from '../composables/useStorefront'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'

const route = useRoute()
const router = useRouter()
const flowStore = useContributionFlowStore()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const eventQuery = useStorefrontEvent(eventSlug.value)

watchEffect(() => {
  flowStore.initialise(eventSlug.value)
})
</script>
