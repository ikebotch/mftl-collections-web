<template>
  <div class="space-y-10 pb-20">
    <AdminPageHeader
      v-if="event"
      :title="`${event.title} - Recipient Funds`"
      description="Manage allocation targets, financial goals, and operational status for campaign funds."
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="bg-white"
            @click="router.push(`/admin/events/${eventId}`)"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Event
          </AppButton>
          <AppButton
            variant="primary"
            @click="router.push(`/admin/funds/new?eventId=${eventId}`)"
          >
            <Plus class="w-4 h-4 mr-2" />
            New Fund
          </AppButton>
        </div>
      </template>
    </AdminPageHeader>

    <div
      v-if="query.isLoading.value"
      class="py-32"
    >
      <LoadingState text="Loading operational funds..." />
    </div>

    <div v-else-if="event" class="space-y-8">
      <AppCard class="!p-0 overflow-hidden border-slate-200/60">
        <EventRecipientFundsList :event-id="eventId" />
      </AppCard>

      <!-- Quick Stats / Insights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AppCard class="!p-10 border-slate-100 bg-slate-50/30">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Total Capacity</p>
          <p class="text-2xl font-black text-slate-900 tracking-tight">GHS 500,000.00</p>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Combined fund targets</p>
        </AppCard>
        <AppCard class="!p-10 border-slate-100 bg-slate-50/30">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Allocation Mix</p>
          <p class="text-2xl font-black text-slate-900 tracking-tight">4 Active Funds</p>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Balanced distribution</p>
        </AppCard>
        <AppCard class="!p-10 border-slate-100 bg-slate-50/30">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Fund Velocity</p>
          <div class="flex items-center gap-2 mt-1">
            <TrendingUp class="w-4 h-4 text-emerald-500" />
            <p class="text-2xl font-black text-slate-900 tracking-tight">+18.5%</p>
          </div>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Growth vs last cycle</p>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '../composables/useEvents'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import EventRecipientFundsList from '../components/EventRecipientFundsList.vue'
import { ArrowLeft, Plus, TrendingUp } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => route.params.id as string)
const query = useEvent(eventId.value)
const event = computed(() => query.data.value)
</script>
