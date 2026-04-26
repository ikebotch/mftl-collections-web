<template>
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-20">
    <section class="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
      <!-- Hero Section -->
      <div class="relative group">
        <div class="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-emerald-500/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000" />
        <AppCard class="relative overflow-hidden bg-slate-900 border-none shadow-2xl rounded-[2rem]">
          <div 
            v-if="eventQuery.data.value?.displayImageUrl"
            class="absolute inset-0 z-0"
          >
            <img 
              :src="eventQuery.data.value.displayImageUrl" 
              class="w-full h-full object-cover opacity-30"
              alt="Event banner"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          </div>

          <div v-else>
            <div class="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 blur-3xl rounded-full -mr-48 -mt-48" />
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -ml-32 -mb-32" />
          </div>
          
          <div class="relative p-8 md:p-14 z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-8">
              <span class="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Support this event
            </div>
            
            <h2 class="text-4xl md:text-6xl font-bold leading-[1.1] text-white font-display mb-6">
              {{ eventQuery.data.value?.title }}
            </h2>
            
            <p class="text-lg md:text-xl text-slate-200 font-medium leading-relaxed mb-12 max-w-xl">
              {{ eventQuery.data.value?.description }}
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <AppButton
                variant="primary"
                size="lg"
                class="bg-violet-600 text-white shadow-xl shadow-violet-600/20"
                @click="router.push(`/give/${eventSlug}/recipient`)"
              >
                Start Contribution
              </AppButton>
              <AppButton
                size="lg"
                variant="outline"
                class="!text-slate-200 !border-slate-700 hover:!bg-slate-800 hover:!text-white hover:!border-slate-600"
                @click="router.push(`/give/${eventSlug}/self`)"
              >
                I am contributing for myself
              </AppButton>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Info Sidebar -->
      <div class="space-y-8">
        <AppCard
          padded
          class="border-slate-100 shadow-xl"
        >
          <div class="p-3 w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 mb-6 flex items-center justify-center shadow-sm">
            🛡️
          </div>
          <h3 class="text-xl font-bold font-display text-slate-900 mb-4">
            Secure & Transparent
          </h3>
          <p class="text-sm text-slate-500 leading-relaxed mb-6">
            Our platform ensures every contribution is handled with the highest level of security and transparency.
          </p>
          <ul class="space-y-4">
            <li
              v-for="(item, i) in ['End-to-end encryption', 'Real-time fund tracking', 'Instant digital receipts']"
              :key="i"
              class="flex items-center gap-3 text-sm font-bold text-slate-700"
            >
              <span class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
              {{ item }}
            </li>
          </ul>
        </AppCard>

        <AppCard
          padded
          class="bg-gradient-to-br from-slate-50 to-white border-slate-100"
        >
          <h3 class="text-sm font-bold uppercase tracking-widest text-slate-600 mb-6">
            Payment Methods
          </h3>
          <div class="grid grid-cols-4 gap-4 grayscale opacity-60">
            <div
              v-for="i in 4"
              :key="i"
              class="h-10 rounded-lg bg-slate-200 animate-pulse"
            />
          </div>
          <p class="mt-6 text-xs text-slate-500 text-center font-medium italic">
            "Supporting your community, one contribution at a time."
          </p>
        </AppCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStorefrontEvent } from '../composables/useStorefront'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'

const route = useRoute()
const router = useRouter()
const flowStore = useContributionFlowStore()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const eventQuery = useStorefrontEvent(eventSlug.value)

watchEffect(() => {
  flowStore.initialise(eventSlug.value)
})
</script>
