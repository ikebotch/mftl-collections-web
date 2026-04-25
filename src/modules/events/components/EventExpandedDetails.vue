<template>
  <div class="relative pl-10 py-6 animate-in fade-in slide-in-from-left-2 duration-500">
    <!-- Continuity Border -->
    <div class="absolute left-0 top-0 bottom-0 w-[1px] bg-violet-500/30" />
    <div class="absolute left-0 top-0 h-24 w-[1px] bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.3)]" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <!-- 1. Fund Distribution -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2.5">
            <Target class="w-3.5 h-3.5 text-violet-500" />
            Fund Distribution
          </h4>
          <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">{{ funds.length }} Active Targets</span>
        </div>
        
        <div class="divide-y divide-slate-100/60 border-t border-slate-100/60">
          <div 
            v-for="fund in funds" 
            :key="fund.id"
            class="group py-5 flex items-center justify-between"
          >
            <div class="flex-1">
              <p class="text-xs font-black text-slate-900 tracking-tight uppercase leading-none">{{ fund.name }}</p>
              <div class="flex items-center gap-3 mt-3">
                <div class="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {{ collectorMapping[fund.id]?.length || 0 }} Field Agents Assigned
                </span>
              </div>
            </div>
            
            <div class="flex flex-col items-end gap-3 min-w-[140px]">
              <div class="flex items-baseline gap-1.5">
                <span class="text-[12px] font-black text-slate-900 tracking-tighter italic">
                  {{ formatCurrency(getGhsTotal(fund), 'GHS') }}
                </span>
              </div>
              <!-- Progress bar with high-end silhouette -->
              <div
                v-if="fund.targetAmount > 0"
                class="h-0.5 w-full bg-slate-50 overflow-hidden"
              >
                <div 
                  class="h-full transition-all duration-1000" 
                  :class="getProgressColor(fund)" 
                  :style="{ width: `${calculateProgress(fund)}%` }" 
                />
              </div>
            </div>
          </div>
          
          <div v-if="!funds.length" class="py-12 flex items-center gap-4 opacity-40">
            <div class="w-8 h-8 bg-slate-100 flex items-center justify-center border border-slate-200">
              <Target class="w-4 h-4 text-slate-400" />
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">No strategic funds defined for this stream.</p>
          </div>
        </div>
      </div>

      <!-- 2. Field Operations (Combined View) -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2.5">
            <Users class="w-3.5 h-3.5 text-amber-500" />
            Field Operations
          </h4>
          <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">{{ combinedOperations.length }} Active Channels</span>
        </div>
        
        <div class="divide-y divide-slate-100/60 border-t border-slate-100/60">
          <div 
            v-for="op in combinedOperations" 
            :key="op.id"
            class="py-5 flex items-center justify-between group"
          >
            <div class="flex items-center gap-4">
              <!-- Identity Dot -->
              <div 
                class="w-2.5 h-2.5 rounded-full"
                :class="[
                  op.type === 'staff' 
                    ? (op.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-300')
                    : 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                ]"
              />
              <div>
                <div class="flex items-center gap-2.5">
                  <p class="text-[11px] font-black text-slate-900 tracking-tight uppercase leading-none">{{ op.name }}</p>
                  <span 
                    v-if="op.type !== 'staff'"
                    class="px-1.5 py-0.5 bg-violet-600 text-white text-[7px] font-black uppercase tracking-[0.2em]"
                  >
                    {{ op.type }}
                  </span>
                </div>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-none">
                  {{ op.meta }}
                </p>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-[12px] font-black text-slate-900 tracking-tighter italic leading-none">
                {{ formatCurrency(op.amount, 'GHS') }}
              </p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-none">
                Raised Today
              </p>
            </div>
          </div>
          
          <div
            v-if="!combinedOperations.length && !loading"
            class="py-12 flex flex-col items-start gap-8"
          >
            <div class="flex items-center gap-4 opacity-40">
              <div class="w-8 h-8 bg-slate-100 flex items-center justify-center border border-slate-200">
                <Users class="w-4 h-4 text-slate-400" />
              </div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                Zero field activity recorded for this period.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <AppButton 
                variant="primary" 
                size="sm" 
                @click="showDeployModal = true"
              >
                <template #icon><UserPlus class="w-3.5 h-3.5 mr-2.5" /></template>
                Assign Existing
              </AppButton>
              <AppButton 
                variant="secondary" 
                size="sm" 
                @click="router.push('/admin/collectors/new')"
              >
                <template #icon><Plus class="w-3.5 h-3.5 mr-2.5" /></template>
                Onboard New
              </AppButton>
            </div>
          </div>

          <div v-if="loading" class="py-12">
            <div class="h-4 w-4 animate-spin border-2 border-slate-200 border-t-violet-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <StaffDeploymentModal
      v-if="showDeployModal"
      :event-id="eventId"
      @close="showDeployModal = false"
      @deployed="handleDeployed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Target, Users, UserPlus, Plus } from 'lucide-vue-next'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { collectorService } from '@/modules/collector/services/collectorService'
import { formatCurrency } from '@/core/formatting/formatters'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'
import type { CollectorProfile } from '@/modules/collector/types/collector'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import StaffDeploymentModal from './StaffDeploymentModal.vue'

const props = defineProps<{
  eventId: string
}>()

const router = useRouter()
const funds = ref<RecipientFund[]>([])
const collectors = ref<CollectorProfile[]>([])
const loading = ref(true)
const showDeployModal = ref(false)
const collectorMapping = ref<Record<string, string[]>>({})

// Combined operations view to handle "Online" and "Direct" residuals
const combinedOperations = computed(() => {
  const ops = collectors.value.map(c => ({
    id: c.id,
    type: 'staff',
    name: c.name,
    meta: c.email,
    amount: c.totalCollectedToday,
    status: c.status
  }))

  // Calculate residuals (Online/Direct)
  // We check if the total raised in funds exceeds what staff have recorded.
  // This accounts for "Online" ($50 case) and "System" entries.
  const fundTotals = funds.value.reduce((acc, f) => acc + (f.totals?.find(t => t.currency === 'GHS')?.amount || 0), 0)
  const staffTotals = collectors.value.reduce((acc, c) => acc + c.totalCollectedToday, 0)
  const residual = fundTotals - staffTotals

  if (residual > 0.01) { // Floating point buffer
    ops.unshift({
      id: 'online-residual',
      type: 'online',
      name: 'System / Online Flow',
      meta: 'ECOMMERCE & DIRECT PAYMENT GATEWAYS',
      amount: residual,
      status: 'Active'
    })
  }

  return ops
})

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const [fundList, collectorList] = await Promise.all([
      recipientFundsService.listByEvent(props.eventId),
      collectorService.listAll({ eventId: props.eventId })
    ])
    funds.value = fundList
    collectors.value = collectorList
    
    // Derived mapping based on recent contributions or manual assignments
    collectorMapping.value = fundList.reduce((acc, f) => ({
      ...acc,
      [f.id]: collectorList.filter(c => c.totalCollectedToday > 0).map(c => c.id) 
    }), {})
  } catch (err) {
    console.error('Failed to load expanded details:', err)
  } finally {
    loading.value = false
  }
}

function handleDeployed() {
  showDeployModal.value = false
  fetchData()
}

function getGhsTotal(fund: RecipientFund) {
  return fund.totals?.find(t => t.currency === 'GHS')?.amount ?? 0
}

function calculateProgress(fund: RecipientFund) {
  if (!fund.targetAmount) return 0
  return Math.min(100, Math.round((getGhsTotal(fund) / fund.targetAmount) * 100))
}

function getProgressColor(fund: RecipientFund) {
  const progress = calculateProgress(fund)
  if (progress >= 100) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
  if (progress >= 50) return 'bg-violet-600'
  if (progress > 0) return 'bg-slate-900'
  return 'bg-slate-200'
}
</script>
