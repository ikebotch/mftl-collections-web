<template>
  <div class="space-y-5">
    <article class="rounded-none border border-white/10 bg-white/[0.04] p-5">
      <p class="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Collector event
      </p>
      <h2 class="mt-3 text-2xl font-semibold text-white">
        {{ eventId ? 'Assigned event ready' : 'Event not found' }}
      </h2>
      <p class="mt-3 text-sm leading-6 text-slate-300">
        Move directly into the collection form with the selected event preloaded and its assigned funds filtered automatically.
      </p>
    </article>

    <AppButton
      class="w-full !rounded-none !py-4"
      @click="router.push(`/collector/contributions/new?eventId=${eventId}`)"
    >
      Open New Contribution
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/shared/components/buttons/AppButton.vue'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => String(route.params.id ?? ''))
</script>
