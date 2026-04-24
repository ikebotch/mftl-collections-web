<template>
  <div class="space-y-12">
    <!-- Editorial Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-2 h-10 bg-amber-500" />
          <h1 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Settlements
          </h1>
        </div>
        <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-5">
          Cash Reconciliation & Field Agent Settlements
        </p>
      </div>
    </div>

    <!-- Backend Pending Alert -->
    <section class="p-10 rounded-[3rem] bg-amber-50 border-2 border-amber-100 flex items-center gap-8 relative overflow-hidden">
      <div class="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1),transparent)] pointer-events-none" />
      <div class="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-amber-500 shadow-xl shrink-0">
        <Database class="w-10 h-10" />
      </div>
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase italic">
          Backend Implementation Pending
        </h2>
        <p class="text-sm font-bold text-amber-900/60 uppercase tracking-widest mt-1">
          Settlement API Bridge Not Active
        </p>
        <p class="text-slate-600 font-medium mt-4 max-w-2xl text-sm leading-relaxed">
          The settlement engine is currently being finalized. This module will allow finance teams to reconcile physical cash collected in the field with digital audit logs once the backend orchestration is complete.
        </p>
      </div>
    </section>

    <!-- Operational Ledger (Simulated) -->
    <section class="space-y-6">
      <div class="flex items-center justify-between px-2">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Pending Field Reconciliations
        </h3>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Simulation Mode Active</span>
      </div>

      <AppCard class="!rounded-[3rem] overflow-hidden border-2 border-slate-100 shadow-2xl bg-white">
        <AppTable
          :columns="columns"
          :rows="mockSettlements"
          row-key="id"
          class="!border-none"
        >
          <template #cell:collectorName="{ value }">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 shrink-0">
                {{ getInitials(value) }}
              </div>
              <span class="text-sm font-bold text-slate-900">{{ value }}</span>
            </div>
          </template>

          <template #cell:status="{ value }">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 w-fit">
              <div class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ value }}</span>
            </div>
          </template>

          <template #cell:amount="{ value }">
            <span class="text-sm font-black text-slate-900 italic">{{ formatCurrency(value, 'GHS') }}</span>
          </template>

          <template #cell:date="{ value }">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ value }}</span>
          </template>

          <template #cell:actions>
            <AppButton 
              variant="ghost" 
              size="sm" 
              class="!rounded-xl border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 opacity-50 cursor-not-allowed"
            >
              Reconcile
            </AppButton>
          </template>
        </AppTable>
      </AppCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/shared/utils/formatters'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { Database } from 'lucide-vue-next'

const columns = [
  { key: 'collectorName', label: 'Collector' },
  { key: 'amount', label: 'Cash Pending' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Collection Date' },
  { key: 'actions', label: '' },
]

const mockSettlements = [
  { id: '1', collectorName: 'Samuel Osei', amount: 1250.00, status: 'Awaiting Handover', date: 'Oct 24, 2023' },
  { id: '2', collectorName: 'Grace Mensah', amount: 840.50, status: 'In Review', date: 'Oct 24, 2023' },
  { id: '3', collectorName: 'Isaac Boateng', amount: 3200.00, status: 'Awaiting Handover', date: 'Oct 23, 2023' },
  { id: '4', collectorName: 'Akosua Serwaa', amount: 150.00, status: 'Completed', date: 'Oct 22, 2023' },
]

function getInitials(name?: string) {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
