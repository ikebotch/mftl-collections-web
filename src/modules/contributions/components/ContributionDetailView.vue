<template>
  <div class="space-y-10 animate-in fade-in duration-700">
    <!-- Hero Section -->
    <section class="p-10 border-b border-white/5 bg-white/[0.02] flex flex-col items-center text-center">
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
        Operational Value
      </p>
      <p class="text-6xl font-black text-white tracking-tighter tabular-nums leading-none">
        {{ contribution.amount }}
      </p>
      <div class="mt-8 flex items-center gap-3">
        <div 
          class="px-3 py-1 text-[9px] font-black uppercase tracking-widest border"
          :class="statusClasses"
        >
          {{ contribution.status || 'Verified' }}
        </div>
        <div class="h-1 w-8 bg-white/10" />
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ contribution.paymentMethod }}</span>
      </div>
    </section>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-10 px-2">
      <div class="space-y-1.5">
        <h4 class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
          Source Identity
        </h4>
        <p class="text-sm font-black text-white uppercase leading-tight">
          {{ contribution.contributorName || 'Anonymous Node' }}
        </p>
        <p class="text-[11px] font-bold text-slate-400 mt-1 tracking-widest">
          {{ contribution.contributorPhone || 'NO CONTACT RECORD' }}
        </p>
      </div>
      <div class="space-y-1.5 text-right">
        <h4 class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
          Settlement
        </h4>
        <p class="text-sm font-black text-white uppercase tracking-widest">
          {{ contribution.paymentMethod }}
        </p>
        <p class="text-[11px] font-bold text-emerald-500 mt-1 tracking-widest">
          AUTHORIZED
        </p>
      </div>
    </div>

    <!-- Allocation Map -->
    <div class="space-y-5 pt-8 border-t border-white/5 px-2">
      <div class="flex justify-between items-start gap-4">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Hub</span>
        <span class="text-xs font-black text-white uppercase text-right leading-tight max-w-[60%]">{{ contribution.eventTitle || contribution.event }}</span>
      </div>
      <div class="flex justify-between items-start gap-4">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Allocation</span>
        <span class="text-xs font-black text-white uppercase text-right leading-tight max-w-[60%]">{{ contribution.recipientFund || contribution.recipientFundName || contribution.fundName }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Audit ID</span>
        <span class="text-xs font-mono text-violet-400 font-bold uppercase tracking-tighter">{{ contribution.receiptId || contribution.receiptNumber || 'N/A' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Operator</span>
        <span class="text-xs font-black text-slate-400 lowercase italic">{{ contribution.collectorName || 'system.node' }}</span>
      </div>
    </div>

    <!-- Operational Note -->
    <div
      v-if="contribution.note"
      class="p-6 bg-violet-500/5 border border-violet-500/10"
    >
      <p class="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 mb-3">
        Field Observation
      </p>
      <p class="text-xs text-slate-300 font-medium italic leading-relaxed">
        "{{ contribution.note }}"
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  contribution: any
}>()

const statusClasses = computed(() => {
  const s = props.contribution.status?.toLowerCase() || ''
  if (s === 'completed' || s === 'collected' || s === 'issued') {
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
  }
  if (s === 'pending') {
    return 'bg-amber-500/10 border-amber-500/20 text-amber-400'
  }
  return 'bg-slate-500/10 border-slate-500/20 text-slate-400'
})
</script>
