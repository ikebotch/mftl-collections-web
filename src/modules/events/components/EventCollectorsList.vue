<template>
  <div class="space-y-6">
    <div
      v-if="loading"
      class="py-12 flex justify-center"
    >
      <div class="h-8 w-8 animate-spin rounded-none border-2 border-slate-200 border-t-violet-600" />
    </div>
    
    <div
      v-else-if="collectors.length === 0"
      class="p-20 text-center border border-dashed border-slate-200 bg-slate-50/10 flex flex-col items-center gap-6"
    >
      <div class="w-16 h-16 rounded-none bg-slate-50 flex items-center justify-center border border-slate-100">
        <Users class="w-8 h-8 text-slate-300" />
      </div>
      <div class="space-y-2">
        <p class="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
          No Field Staff Provisioned
        </p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-relaxed">
          Operational efficiency requires dedicated personnel. Assign existing staff or onboard new members.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <AppButton
          variant="primary"
          size="sm"
          class="text-[10px] uppercase tracking-widest font-black"
          @click="showAssignModal = true"
        >
          <UserPlus class="w-3 h-3 mr-2" />
          Assign Existing
        </AppButton>
        <AppButton
          variant="outline"
          size="sm"
          class="text-[10px] uppercase tracking-widest font-black bg-transparent border-slate-200"
          @click="router.push('/admin/collectors/new')"
        >
          <Plus class="w-3 h-3 mr-2" />
          Onboard New
        </AppButton>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AppCard
        v-for="collector in collectors"
        :key="collector.id"
        class="!p-6 border-slate-200 group hover:border-violet-300 transition-all duration-500"
      >
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black group-hover:bg-violet-50 group-hover:text-violet-600 group-hover:border-violet-100 transition-all duration-500">
              {{ collector.name.charAt(0) }}
            </div>
            <div>
              <p class="text-[15px] font-black text-slate-900 tracking-tighter leading-none uppercase">
                {{ collector.name }}
              </p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 leading-none">
                {{ collector.status }}
              </p>
            </div>
          </div>
          <div 
            class="w-2 h-2 rounded-none"
            :class="collector.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-100">
          <div class="flex justify-between items-end">
            <div class="space-y-3">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                Collected Today
              </p>
              <p class="text-[15px] font-black text-slate-900 italic tracking-tighter leading-none">
                {{ formatCurrency(collector.totalCollectedToday, 'GHS') }}
              </p>
            </div>
            <div class="text-right space-y-3">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                Receipts Issued
              </p>
              <p class="text-[15px] font-black text-slate-900 tracking-tighter leading-none tabular-nums">
                {{ collector.receiptsIssuedToday }}
              </p>
            </div>
          </div>
          
          <div class="pt-2">
            <AppButton
              variant="ghost"
              size="xs"
              class="w-full text-[9px] uppercase tracking-[0.2em] font-black bg-slate-50 border border-slate-100 group-hover:bg-violet-50 group-hover:text-violet-600 transition-all"
              @click="router.push(`/admin/collectors/${collector.id}`)"
            >
              Performance Profile
            </AppButton>
          </div>
        </div>
      </AppCard>

      <!-- Add Staff Trigger Card -->
      <div 
        class="border border-dashed border-slate-200 bg-slate-50/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-violet-300 group transition-all min-h-[160px]"
        @click="showAssignModal = true"
      >
        <div class="w-10 h-10 rounded-none bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-violet-500 group-hover:border-violet-100 transition-colors">
          <UserPlus class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600">Assign Staff</span>
      </div>
    </div>

    <!-- Assignment Modal -->
    <AppModal
      v-if="showAssignModal"
      title="Staff Deployment"
      subtitle="Assign existing field collectors to this campaign."
      @close="showAssignModal = false"
    >
      <div class="space-y-6">
        <div class="max-h-[400px] overflow-y-auto pr-2 space-y-2">
          <div 
            v-for="staff in availableStaff" 
            :key="staff.id"
            class="p-4 border border-slate-100 bg-slate-50/30 flex items-center justify-between group cursor-pointer"
            :class="{ '!border-violet-600 !bg-violet-50/50': isSelected(staff.id) }"
            @click="toggleSelection(staff.id)"
          >
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-none bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">
                {{ staff.name.charAt(0) }}
              </div>
              <div>
                <p class="text-xs font-black text-slate-900 tracking-tight leading-none uppercase">
                  {{ staff.name }}
                </p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">
                  {{ staff.email }}
                </p>
              </div>
            </div>
            <div 
              class="w-5 h-5 border-2 flex items-center justify-center"
              :class="isSelected(staff.id) ? 'bg-violet-600 border-violet-600' : 'border-slate-200 bg-white'"
            >
              <Check
                v-if="isSelected(staff.id)"
                class="w-3.5 h-3.5 text-white"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-6 border-t border-slate-100">
          <AppButton 
            variant="outline" 
            class="flex-1 bg-transparent border-slate-200" 
            @click="showAssignModal = false"
          >
            Cancel
          </AppButton>
          <AppButton 
            variant="primary" 
            class="flex-1" 
            :loading="assigning"
            :disabled="selectedIds.length === 0"
            @click="handleAssign"
          >
            Deploy {{ selectedIds.length }} Staff
          </AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Users, Plus, UserPlus, Check } from 'lucide-vue-next'
import { collectorService } from '@/modules/collector/services/collectorService'
import { eventService } from '@/modules/events/services/eventService'
import { formatCurrency } from '@/core/formatting/formatters'
import { useToastStore } from '@/shared/stores/useToastStore'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppModal from '@/shared/components/modals/AppModal.vue'
import type { CollectorProfile } from '@/modules/collector/types/collector'

const props = defineProps<{
  eventId: string
}>()

const router = useRouter()
const toast = useToastStore()
const collectors = ref<CollectorProfile[]>([])
const availableStaff = ref<CollectorProfile[]>([])
const selectedIds = ref<string[]>([])
const loading = ref(true)
const assigning = ref(false)
const showAssignModal = ref(false)

async function loadCollectors() {
  try {
    collectors.value = await collectorService.listAll({ eventId: props.eventId })
  } catch (err) {
    console.error('Failed to load event collectors:', err)
  }
}

async function loadAvailableStaff() {
  try {
    const all = await collectorService.listAll()
    // Filter out those already assigned
    availableStaff.value = all.filter(s => !collectors.value.some(c => c.id === s.id))
  } catch (err) {
    console.error('Failed to load available staff:', err)
  }
}

onMounted(async () => {
  loading.value = true
  await loadCollectors()
  await loadAvailableStaff()
  loading.value = false
})

function isSelected(id: string) {
  return selectedIds.value.includes(id)
}

function toggleSelection(id: string) {
  if (isSelected(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id)
  } else {
    selectedIds.value.push(id)
  }
}

async function handleAssign() {
  if (selectedIds.value.length === 0) return
  
  assigning.value = true
  try {
    await eventService.assignStaff(props.eventId, selectedIds.value)
    toast.success('Staff deployed successfully to campaign')
    await loadCollectors()
    await loadAvailableStaff()
    selectedIds.value = []
    showAssignModal.value = false
  } catch (err) {
    console.error('Failed to assign staff:', err)
    toast.error('Deployment failed')
  } finally {
    assigning.value = false
  }
}
</script>
