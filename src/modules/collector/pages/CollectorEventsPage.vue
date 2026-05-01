<template>
  <div class="min-h-screen bg-[#060B16] text-white selection:bg-violet-500/30">
    <!-- ══════════════════════════════════════════════════
         TERMINAL HEADER
    ══════════════════════════════════════════════════ -->
    <header class="px-6 pt-12 pb-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
      <div class="max-w-xl mx-auto space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-1.5 bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.5)] animate-pulse" />
          <p class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">
            Operational Protocol
          </p>
        </div>
        <h1 class="text-4xl font-black text-white uppercase tracking-tight italic leading-none">
          Assigned Shifts
        </h1>
        <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Authorized collection hubs for this node
        </p>
      </div>
    </header>

    <main class="max-w-xl mx-auto px-6 py-10 pb-32 space-y-8">
      <div
        v-if="query.isLoading.value"
        class="py-20 flex flex-col items-center"
      >
        <LoadingState
          text="Syncing assignments…"
          class="!text-slate-400"
        />
      </div>
      
      <div
        v-else-if="query.isError.value"
        class="py-12"
      >
        <ErrorState
          title="Terminal Access Denied"
          :message="query.error.value?.message ?? 'Node connection failed.'"
          show-retry
          class="!bg-white/5 !border-white/10"
          @retry="query.refetch"
        />
      </div>
      
      <template v-else-if="query.data.value">
        <!-- Status Tabs -->
        <div class="grid grid-cols-2 gap-2 border border-white/10 bg-white/[0.03] p-1.5">
          <button
            v-for="tab in ['events', 'funds']"
            :key="tab"
            class="py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300"
            :class="activeTab === tab ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'"
            @click="activeTab = tab as any"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Warning: No Assignments -->
        <div
          v-if="!query.data.value.hasAssignments"
          class="border border-amber-500/20 bg-amber-500/5 p-8 flex gap-6 items-start animate-in fade-in duration-500"
        >
          <div class="w-12 h-12 bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <AlertTriangle class="w-7 h-7" />
          </div>
          <div class="space-y-1">
            <h4 class="text-amber-500 font-black uppercase tracking-widest text-xs">
              No Authorized Protocol
            </h4>
            <p class="text-xs text-slate-400 leading-relaxed font-medium">
              Contact your hub administrator to provision collection shifts for this terminal node.
            </p>
          </div>
        </div>

        <!-- Events List -->
        <div
          v-else-if="activeTab === 'events'"
          class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div
            v-if="query.data.value.events.length === 0"
            class="border border-dashed border-white/10 bg-white/[0.01] p-16 text-center"
          >
            <Calendar class="w-12 h-12 text-slate-800 mx-auto mb-6" />
            <p class="text-xs font-black text-slate-600 uppercase tracking-widest">
              No Assigned Events Detected
            </p>
          </div>

          <button
            v-for="event in query.data.value.events"
            :key="event.id"
            class="w-full bg-white/[0.03] border border-white/10 p-6 flex gap-6 items-center hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-left group active:scale-[0.98]"
            @click="router.push(`/collector/contributions/new?eventId=${event.id}`)"
          >
            <div class="relative h-20 w-20 shrink-0 border border-white/10 bg-[#0F172A] flex items-center justify-center">
              <Calendar class="w-8 h-8 text-slate-800" />
              <div class="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-50" />
              <div
                class="absolute bottom-2 right-2 w-2.5 h-2.5 border-2 border-[#0F172A] shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                :class="event.status.toLowerCase() === 'live' ? 'bg-emerald-500' : 'bg-amber-500'"
              />
            </div>
            
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                  <p class="text-[9px] font-black uppercase tracking-[0.3em] text-violet-400">
                    {{ event.status }} Hub
                  </p>
                  <h3 class="text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-violet-400 transition-colors">
                    {{ event.title }}
                  </h3>
                </div>
                <ArrowRight class="w-5 h-5 text-slate-800 group-hover:text-violet-500 transition-colors shrink-0 mt-2" />
              </div>
              
              <div class="mt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <div class="flex items-center gap-1.5">
                  <MapPin class="w-3 h-3" /> {{ event.location }}
                </div>
                <div class="flex items-center gap-1.5">
                  <Clock class="w-3 h-3" /> {{ event.dateLabel }}
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Funds List -->
        <div
          v-else
          class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div
            v-if="query.data.value.funds.length === 0"
            class="border border-dashed border-white/10 bg-white/[0.01] p-16 text-center"
          >
            <LayoutGrid class="w-12 h-12 text-slate-800 mx-auto mb-6" />
            <p class="text-xs font-black text-slate-600 uppercase tracking-widest">
              No Authorized Funds Detected
            </p>
          </div>

          <button
            v-for="fund in query.data.value.funds"
            :key="fund.id"
            class="w-full bg-white/[0.03] border border-white/10 p-8 hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-left group active:scale-[0.98] relative overflow-hidden"
            @click="router.push(`/collector/contributions/new?eventId=${fund.eventId}&fundId=${fund.id}`)"
          >
            <div class="relative z-10 flex flex-col gap-6">
              <div class="flex items-center justify-between gap-6">
                <h3 class="text-2xl font-black text-white uppercase tracking-tight leading-none group-hover:text-violet-400 transition-colors">
                  {{ fund.name }}
                </h3>
                <div class="text-[10px] font-black text-violet-400 uppercase tracking-widest tabular-nums">
                  {{ fund.progress }}% Protocol
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="h-1.5 w-full bg-white/5 overflow-hidden">
                  <div 
                    class="h-full bg-violet-600 shadow-[0_0_12px_rgba(124,58,237,0.4)] transition-all duration-1000"
                    :style="{ width: `${fund.progress}%` }"
                  />
                </div>
                <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span class="text-slate-500">Collected Node Value</span>
                  <span class="text-white">{{ formatCurrency(fund.collectedAmount, fund.currency) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Decorative background -->
            <LayoutGrid class="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-[0.01] pointer-events-none" />
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorAssignments } from '../composables/useCollector'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  ArrowRight, 
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
