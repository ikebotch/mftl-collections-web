<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <div class="space-y-1">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80">Regional Campaign Stream</h3>
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Operational events tied to this hub</p>
      </div>
      <AppButton
        variant="ghost"
        size="xs"
        class="text-[10px] font-black uppercase tracking-widest text-violet-600 border border-violet-100 hover:bg-violet-50"
        @click="router.push(`/admin/events/new?branchId=${branchId}`)"
      >
        <Plus class="w-3.5 h-3.5 mr-2" /> Initialize Event
      </AppButton>
    </div>

    <DataTable
      :columns="columns"
      :rows="events"
      :loading="isLoading"
      @retry="fetchEvents"
    >
      <template #cell:title="{ row }">
        <div 
          class="flex items-center gap-4 group/item py-1 cursor-pointer"
          @click="router.push(`/admin/events/${row.id}`)"
        >
          <div 
            class="w-2 h-2 shrink-0 rounded-full"
            :class="row.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
          <div class="min-w-0">
            <p class="text-sm font-black text-slate-900 truncate tracking-tight leading-none group-hover/item:text-violet-600 transition-colors">
              {{ row.title }}
            </p>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">
              {{ row.isActive ? 'Active' : 'Draft' }}
            </p>
          </div>
        </div>
      </template>

      <template #cell:raised="{ row }">
        <div class="flex flex-col gap-1 py-1">
          <span 
            v-for="total in row.totals" 
            :key="total.currency"
            class="text-xs font-black italic tracking-tight leading-none text-slate-900"
          >
            {{ formatCurrency(total.amount, total.currency) }}
          </span>
          <span v-if="!row.totals?.length" class="text-xs font-black text-slate-300 italic">
            GHS 0.00
          </span>
        </div>
      </template>

      <template #cell:team="{ row }">
        <div class="flex items-center gap-2">
          <Users class="w-3 h-3 text-slate-300" />
          <span class="text-xs font-black text-slate-900">{{ row.collectorCount || 0 }}</span>
        </div>
      </template>

      <template #rowActions="{ row }">
        <AppButton
          variant="ghost"
          size="xs"
          class="hover:bg-slate-100 border border-transparent hover:border-slate-200"
          @click="router.push(`/admin/events/${row.id}`)"
        >
          <ArrowRight class="w-3.5 h-3.5" />
        </AppButton>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { eventsService } from '@/modules/events/services/eventsService'
import DataTable from '@/shared/components/tables/DataTable.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { Plus, Users, ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  branchId: string
}>()

const router = useRouter()
const events = ref([])
const isLoading = ref(true)

const columns = [
  { key: 'title', label: 'Campaign' },
  { key: 'raised', label: 'Raised' },
  { key: 'team', label: 'Team' }
]

async function fetchEvents() {
  isLoading.value = true
  try {
    events.value = await eventsService.list(props.branchId)
  } catch (error) {
    console.error('Failed to sync branch events:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchEvents)
</script>
