<template>
  <div class="space-y-10 max-w-lg mx-auto pb-20">
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-emerald-100">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        System Online
      </div>
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 leading-tight">
        Field Hub
      </h1>
      <p class="text-slate-500 font-medium">
        Ready for today's collection shift, Isaac.
      </p>
    </div>

    <div class="grid gap-6">
      <MetricCard
        label="Today's Total"
        :value="query.data.value?.todayCollections ?? '$1,450.50'"
        icon="Wallet"
        color="purple"
        trend="+12.5%"
        trend-positive
      />
      <div class="grid grid-cols-2 gap-6">
        <MetricCard
          label="Receipts"
          :value="query.data.value?.receiptsIssued ?? '12'"
          icon="FileText"
          color="green"
        />
        <MetricCard
          label="Assignments"
          :value="query.data.value?.assignedEvents ?? '3'"
          icon="Calendar"
          color="amber"
        />
      </div>
    </div>

    <!-- Premium Offline Sync Card -->
    <div class="relative group overflow-hidden rounded-[2.5rem] bg-navy-950 p-8 shadow-premium border border-navy-900">
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full group-hover:bg-brand-500/30 transition-all duration-700" />
      
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-6">
          <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
            <ShieldCheck class="w-6 h-6 text-brand-400" />
          </div>
          <span class="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest border border-brand-500/20">
            Offline Ready
          </span>
        </div>
        <h3 class="text-xl font-bold font-display text-white">
          Always Connected
        </h3>
        <p class="text-slate-400 text-sm mt-3 leading-relaxed">
          Your collections are automatically synced when the network is available. Keep impacting lives anywhere.
        </p>
        
        <AppButton
          variant="white"
          class="mt-8 w-full py-4 text-sm font-black shadow-xl"
        >
          Verify Sync (Last sync: 2m ago)
        </AppButton>
      </div>
    </div>

    <div class="fixed bottom-8 left-0 right-0 px-6 max-w-lg mx-auto z-50">
      <AppButton
        class="w-full py-5 text-base font-black shadow-2xl shadow-brand-600/40"
        @click="$router.push('/collector/events')"
      >
        <Plus class="w-5 h-5 mr-3" />
        Start New Collection
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollectorDashboard } from '../composables/useCollector'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { 
  ShieldCheck, 
  Plus
} from 'lucide-vue-next'

const query = useCollectorDashboard()
</script>
