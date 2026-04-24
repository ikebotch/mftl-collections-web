<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 text-violet-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
          <span class="w-8 h-px bg-violet-600/30" />
          Event Management
        </div>
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
          Event Details
        </h1>
      </div>
      
      <div class="flex items-center gap-3">
        <AppButton
          variant="secondary"
          @click="router.push('/admin/events')"
        >
          Back to list
        </AppButton>
        <AppButton
          variant="primary"
          @click="router.push(`/admin/events/${eventId}/recipient-funds/new`)"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add Fund
        </AppButton>
      </div>
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing event data..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Sync Failure"
      :message="query.error.value?.message ?? 'Could not retrieve event details.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    
    <div
      v-else-if="query.data.value"
      class="grid gap-8 lg:grid-cols-3"
    >
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-8">
        <AppCard class="p-8">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h2 class="text-2xl font-black text-slate-900 mb-2">
                {{ query.data.value.title }}
              </h2>
              <p class="text-slate-500 font-medium leading-relaxed">
                {{ query.data.value.description }}
              </p>
            </div>
            <EventStatusBadge :status="query.data.value.status" />
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Date
              </p>
              <p class="font-bold text-slate-900">
                {{ formatDate(query.data.value.eventDate) }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Currency
              </p>
              <p class="font-bold text-slate-900 uppercase">
                {{ query.data.value.currency }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Visibility
              </p>
              <p class="font-bold text-emerald-600">
                Public
              </p>
            </div>
          </div>
        </AppCard>

        <!-- Recipient Funds Section -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-black text-slate-900">
              Recipient Funds
            </h3>
            <span class="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
              {{ fundsQuery.data.value?.length ?? 0 }} funds
            </span>
          </div>

          <LoadingState
            v-if="fundsQuery.isLoading.value"
            text="Loading funds..."
          />
          <div
            v-else-if="!fundsQuery.data.value?.length"
            class="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center"
          >
            <Building class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p class="text-slate-900 font-bold mb-1">
              No funds linked to this event
            </p>
            <p class="text-slate-500 text-sm mb-6">
              You need at least one recipient fund to start collecting.
            </p>
            <AppButton
              variant="outline"
              size="sm"
              @click="router.push(`/admin/events/${eventId}/recipient-funds/new`)"
            >
              <Plus class="w-4 h-4 mr-2" />
              Add first fund
            </AppButton>
          </div>
          <div
            v-else
            class="grid gap-4"
          >
            <RecipientFundSummaryCard
              v-for="fund in fundsQuery.data.value"
              :key="fund.id"
              :fund="fund"
            />
          </div>
        </div>
      </div>

      <!-- Sidebar / Quick Actions -->
      <div class="space-y-6">
        <AppCard class="p-6 bg-violet-600 text-white border-none shadow-violet-200">
          <h3 class="text-lg font-black mb-2">
            Collect Contributions
          </h3>
          <p class="text-violet-100 text-sm mb-6 leading-relaxed">
            Open the public contribution page or use the collector mode to record cash.
          </p>
          <div class="space-y-3">
            <AppButton
              full-width
              class="!bg-white !text-violet-600 hover:!bg-violet-50"
              @click="router.push(`/contribute/${eventId}`)"
            >
              Open Storefront
            </AppButton>
            <AppButton
              full-width
              variant="outline"
              class="!border-violet-400 !text-white hover:!bg-violet-500"
              @click="router.push('/collector')"
            >
              Go to Collector Mode
            </AppButton>
          </div>
        </AppCard>

        <AppCard class="p-6">
          <h3 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">
            Statistics
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-500 font-medium">Total Collected</span>
              <span class="font-bold text-slate-900">GBP 0.00</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-500 font-medium">Contributions</span>
              <span class="font-bold text-slate-900">0</span>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEvent } from '../composables/useEvents'
import { useRecipientFunds } from '@/modules/recipient-funds/composables/useRecipientFunds'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import EventStatusBadge from '../components/EventStatusBadge.vue'
import RecipientFundSummaryCard from '@/modules/recipient-funds/components/RecipientFundSummaryCard.vue'
import { formatDate } from '@/shared/utils/formatters'
import { Plus, Building } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => String(route.params.id ?? ''))

const query = useEvent(eventId.value)
const fundsQuery = useRecipientFunds(eventId.value)
</script>
