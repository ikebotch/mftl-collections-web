<template>
  <div class="space-y-8">
    <section class="p-8 rounded-none bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        Total Amount
      </p>
      <p class="text-4xl font-black text-slate-900 tracking-tighter font-display">
        {{ contribution.amount }}
      </p>
      <div class="mt-4 flex items-center gap-2">
        <StatusBadge
          :status="contribution.status"
          :tone="isCompleted ? 'success' : 'neutral'"
        />
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ contribution.paymentMethod }}</span>
      </div>
    </section>

    <div class="grid grid-cols-2 gap-8">
      <div>
        <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Donor
        </h4>
        <p class="text-sm font-black text-slate-900 uppercase">
          {{ contribution.contributorName }}
        </p>
        <p class="text-xs font-bold text-slate-500 mt-1">
          {{ contribution.contributorPhone || 'Anonymous' }}
        </p>
      </div>
      <div>
        <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Method
        </h4>
        <p class="text-sm font-black text-slate-900 uppercase tracking-widest">
          {{ contribution.paymentMethod }}
        </p>
      </div>
    </div>

    <div class="space-y-6 pt-6 border-t border-slate-100">
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event</span>
        <span class="text-xs font-black text-slate-900 uppercase italic">{{ contribution.eventTitle || contribution.event }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Fund</span>
        <span class="text-xs font-black text-slate-900 uppercase italic">{{ contribution.recipientFund || contribution.fundName }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receipt ID</span>
        <span class="text-xs font-mono text-slate-900">{{ contribution.receiptId || contribution.receiptNumber || 'N/A' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collector</span>
        <span class="text-xs font-black text-slate-900 lowercase">{{ contribution.collectorName || 'system.terminal' }}</span>
      </div>
    </div>

    <div
      v-if="contribution.note"
      class="p-6 rounded-none bg-amber-50 text-amber-700 border border-amber-100"
    >
      <p class="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">
        Note
      </p>
      <p class="text-sm font-medium italic">
        "{{ contribution.note }}"
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'

const props = defineProps<{
  contribution: any
}>()

const isCompleted = computed(() => {
  const s = props.contribution.status?.toLowerCase()
  return s === 'completed' || s === 'collected' || s === 'issued'
})
</script>
