<template>
  <div class="space-y-6 pb-20">
    <header class="pt-2">
      <h2 class="text-3xl font-black text-white tracking-tight">
        Assigned Shifts
      </h2>
      <p class="mt-2 text-sm text-slate-400 font-medium">
        Select an event to start collecting contributions.
      </p>
    </header>

    <LoadingState
      v-if="query.isLoading.value"
      text="Syncing assignments…"
      variant="dark"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Sync failed"
      variant="dark"
      :message="query.error.value?.message ?? 'Please check your connection.'"
      show-retry
      @retry="query.refetch"
    />
    
    <template v-else-if="query.data.value">
      <!-- Tabs -->
      <div class="grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-1.5">
        <button
          v-for="tab in ['events', 'funds']"
          :key="tab"
          type="button"
          class="rounded-xl py-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300"
          :class="activeTab === tab ? 'bg-violet-600 text-white shadow-premium' : 'text-slate-500 hover:text-slate-300'"
          @click="activeTab = tab as any"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Assignments Status -->
      <div
        v-if="!query.data.value.hasAssignments"
        class="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 flex gap-4 items-start"
      >
        <div class="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <div>
          <h4 class="text-amber-500 font-bold">
            No active assignments.
          </h4>
          <p class="text-sm text-slate-300 mt-1 leading-relaxed">
            Contact your administrator to be assigned to a collection shift.
          </p>
        </div>
      </div>

      <!-- Events List -->
      <div
        v-else-if="activeTab === 'events'"
        class="space-y-4"
      >
        <div
          v-if="query.data.value.events.length === 0"
          class="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center"
        >
          <Calendar class="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">
            No Assigned Events
          </p>
        </div>

        <article
          v-for="event in query.data.value.events"
          :key="event.id"
          class="relative overflow-hidden active:scale-[0.98] transition-all duration-200 group"
          @click="router.push(`/collector/contributions/new?eventId=${event.id}`)"
        >
          <div class="p-5 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex gap-5 items-center">
            <div class="relative h-24 w-24 shrink-0 overflow-hidden rounded-[2rem] bg-slate-900 border border-white/10 flex items-center justify-center">
              <Calendar class="w-10 h-10 text-slate-800" />
              <div class="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-500/20" />
              <div
                class="absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-slate-900"
                :class="event.status.toLowerCase() === 'live' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400'"
              />
            </div>
            
            <div class="min-w-0 flex-1 py-1">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500 mb-1.5">
                    {{ event.status }}
                  </p>
                  <h3 class="text-xl font-black text-white leading-tight">
                    {{ event.title }}
                  </h3>
                </div>
                <div class="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-violet-600 transition-all">
                  <ChevronRight class="w-6 h-6" />
                </div>
              </div>
              
              <div class="mt-4 space-y-1.5">
                <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <MapPin class="w-3 h-3" />
                  <span>{{ event.location }}</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Clock class="w-3 h-3" />
                  <span>{{ event.dateLabel }}</span>
                </div>
              </div>

              <div class="mt-4 flex items-center gap-2">
                <div class="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {{ event.assignedFundCount }} Assigned Funds
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Funds List -->
      <div
        v-else
        class="space-y-4"
      >
        <div
          v-if="query.data.value.funds.length === 0"
          class="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center"
        >
          <LayoutGrid class="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">
            No Assigned Funds
          </p>
        </div>

        <article
          v-for="fund in query.data.value.funds"
          :key="fund.id"
          class="relative group active:scale-[0.98] transition-transform duration-200"
          @click="router.push(`/collector/contributions/new?eventId=${fund.eventId}&fundId=${fund.id}`)"
        >
          <div class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition duration-500" />
          <div class="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div class="flex items-center justify-between gap-4 mb-4">
              <h3 class="text-xl font-black text-white truncate">
                {{ fund.name }}
              </h3>
              <div class="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                {{ fund.progress }}%
              </div>
            </div>
            
            <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
              <div 
                class="h-full bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full transition-all duration-1000"
                :style="{ width: `${fund.progress}%` }"
              />
            </div>

            <div class="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
              <span class="text-slate-500">Collected</span>
              <span class="text-white">{{ formatCurrency(fund.collectedAmount, fund.currency) }}</span>
            </div>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorAssignments } from '../composables/useCollector'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { 
  ChevronRight, 
  AlertTriangle, 
  Calendar, 
  LayoutGrid,
  MapPin,
  Clock
} from 'lucide-vue-next'

const router = useRouter()
const query = useCollectorAssignments()
const activeTab = ref<'events' | 'funds'>('events')
</script>
