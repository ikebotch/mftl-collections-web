<template>
  <div class="space-y-10">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-display tracking-tight text-slate-900">
          Event Operations
        </h1>
        <p class="text-slate-500 mt-2 font-medium">
          Monitor and manage your collection events in real-time.
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <AppButton
          variant="outline"
          class="hidden sm:flex"
        >
          <Download class="w-4 h-4 mr-2" />
          Export Data
        </AppButton>
        <AppButton
          variant="primary"
          @click="router.push('/admin/events/new')"
        >
          <Plus class="w-4 h-4 mr-2" />
          Create Event
        </AppButton>
      </div>
    </div>

    <!-- KPI Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Events"
        :value="String(query.data.value?.length || 0)"
        icon="Calendar"
        trend="+2 this month"
      />
      <MetricCard
        label="Total Raised"
        :value="formatCurrency(totalRaised, 'GHS')"
        icon="Coins"
        color="green"
      />
      <MetricCard
        label="Active Collectors"
        value="8"
        icon="Users"
      />
      <MetricCard
        label="Contributions"
        value="124"
        icon="Heart"
        trend="+12% vs last week"
      />
    </div>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing event data..."
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Operational sync failed"
      :message="query.error.value?.message ?? 'Please retry.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!query.data.value?.length"
      title="No active events"
      description="Start a new collection event to begin receiving contributions."
      eyebrow="Ready to start?"
    >
      <template #action>
        <AppButton @click="router.push('/admin/events/new')">
          Launch First Event
        </AppButton>
      </template>
    </EmptyState>
    
    <div
      v-else
      class="space-y-4"
    >
      <div 
        v-for="event in query.data.value" 
        :key="event.id"
        class="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all duration-500"
      >
        <div class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-center gap-8">
            <!-- Event Identity -->
            <div class="flex items-center gap-4 min-w-[300px]">
              <div class="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                <div class="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                  <Calendar class="w-8 h-8" />
                </div>
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-bold text-slate-900 truncate group-hover:text-violet-600 transition-colors">
                  {{ event.title }}
                </h3>
                <div class="flex items-center gap-3 mt-1">
                  <span 
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    :class="event.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'"
                  >
                    {{ event.status }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {{ formatEventDate(event.eventDate) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Operational Metrics -->
            <div class="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Raised
                </p>
                <p class="text-sm font-bold text-slate-900">
                  {{ formatCurrency(event.totalRaised || 0, event.currency) }}
                </p>
                <ProgressBar
                  :value="event.totalRaised || 0"
                  :max="event.goalAmount || 1000"
                  class="mt-2"
                />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Public Link
                </p>
                <CopyLinkButton
                  :value="`https://mftl.app/contribute/${event.slug}`"
                  label="Slug"
                />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Type
                </p>
                <p class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                  {{ event.eventType }}
                </p>
              </div>
              <div class="flex justify-end lg:justify-start">
                <div class="flex items-center -space-x-2">
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500"
                  >
                    C{{ i }}
                  </div>
                  <div class="w-8 h-8 rounded-full border-2 border-white bg-violet-50 flex items-center justify-center text-[10px] font-bold text-violet-600">
                    +5
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center gap-2 justify-end">
              <AppButton
                variant="secondary"
                size="sm"
                @click="router.push(`/admin/events/${event.id}`)"
              >
                Manage
              </AppButton>
              <button 
                class="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                @click="toggleExpand(event.id)"
              >
                <ChevronDown 
                  class="w-5 h-5 transition-transform duration-300" 
                  :class="{ 'rotate-180': expandedEvents.has(event.id) }"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Expanded Detail Panel -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div 
            v-if="expandedEvents.has(event.id)"
            class="px-6 pb-6 border-t border-slate-50 bg-slate-50/50"
          >
            <div class="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Nested Funds -->
              <div class="lg:col-span-2">
                <SectionHeader
                  title="Recipient Funds"
                  description="Allocation breakdown for this event."
                />
                <div class="mt-4 space-y-3">
                  <div 
                    v-for="fund in 2" 
                    :key="fund"
                    class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p class="text-sm font-bold text-slate-900">
                        Education Support Fund
                      </p>
                      <p class="text-xs text-slate-500 font-medium">
                        Target: GHS 5,000.00
                      </p>
                    </div>
                    <div class="flex items-center gap-4 text-right">
                      <div>
                        <p class="text-sm font-bold text-emerald-600">
                          GHS 1,200.00
                        </p>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Collected
                        </p>
                      </div>
                      <div class="w-24">
                        <ProgressBar
                          :value="1200"
                          :max="5000"
                          variant="success"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="space-y-6 bg-white p-6 rounded-3xl border border-slate-100">
                <SectionHeader title="Quick Summary" />
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400 uppercase">Avg. Contribution</span>
                    <span class="text-sm font-bold text-slate-900">GHS 45.00</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400 uppercase">Successful Payments</span>
                    <span class="text-sm font-bold text-emerald-600">98%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-400 uppercase">Active Devices</span>
                    <span class="text-sm font-bold text-slate-900">12</span>
                  </div>
                </div>
                <AppButton
                  variant="outline"
                  class="w-full"
                  size="sm"
                >
                  Full Analytics
                </AppButton>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEvents } from '../composables/useEvents'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import ProgressBar from '@/shared/components/misc/ProgressBar.vue'
import CopyLinkButton from '@/shared/components/buttons/CopyLinkButton.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import { formatDate, formatCurrency } from '@/shared/utils/formatters'
import { 
  Plus, 
  Download, 
  Calendar, 
  ChevronDown
} from 'lucide-vue-next'

const router = useRouter()
const query = useEvents()

const expandedEvents = ref<Set<string>>(new Set())

const totalRaised = computed(() => {
  return query.data.value?.reduce((acc, curr) => acc + (curr.totalRaised || 0), 0) || 0
})

function toggleExpand(id: string) {
  if (expandedEvents.value.has(id)) {
    expandedEvents.value.delete(id)
  } else {
    expandedEvents.value.add(id)
  }
}

function formatEventDate(value: unknown): string {
  return formatDate(typeof value === 'string' ? value : null)
}
</script>
