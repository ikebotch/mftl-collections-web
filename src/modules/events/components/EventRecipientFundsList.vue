<template>
  <div class="space-y-6">
    <div
      v-if="isLoading"
      class="flex items-center gap-4 py-8"
    >
      <Loader2 class="w-4 h-4 animate-spin text-slate-400" />
      <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Funds...</span>
    </div>
    <div
      v-else-if="isError"
      class="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500"
    >
      Failed to establish connection to fund service.
    </div>
    <div
      v-else-if="funds.length === 0"
      class="py-16 text-center border border-dashed border-slate-100"
    >
      <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 italic">
        Zero recipient funds defined
      </p>
    </div>
    <div
      v-else
      class="space-y-6"
    >
      <div
        v-for="fund in funds"
        :key="fund.id"
        class="border border-slate-50 transition-all duration-300 group shadow-sm hover:shadow-md overflow-hidden bg-transparent"
      >
        <!-- Inline Editor Mode -->
        <div 
          v-if="editingFundId === fund.id" 
          class="p-10 space-y-8"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AppInput
              v-model="editForm.name"
              label="Fund Name"
              placeholder="e.g. School Supplies"
              required
            />
            <AppInput
              v-model="editForm.targetAmount"
              type="number"
              label="Fund Target"
              placeholder="0.00"
              required
            >
              <template #prefix>
                <span class="text-slate-400 font-bold uppercase tracking-tighter">GHS</span>
              </template>
            </AppInput>
          </div>
          <AppInput
            v-model="editForm.description"
            label="Description"
            placeholder="Short summary of this fund's purpose..."
          />
          <div class="flex items-center justify-between pt-4 border-t border-violet-100/50">
            <div class="flex items-center gap-3">
              <AppSwitch v-model="editForm.isActive" />
              <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fund Active</span>
            </div>
            <div class="flex items-center gap-3">
              <AppButton 
                variant="ghost" 
                size="sm"
                class="text-[10px] font-black uppercase tracking-[0.2em]"
                @click="cancelEditing"
              >
                Cancel
              </AppButton>
              <AppButton 
                variant="primary" 
                size="sm"
                class="text-[10px] font-black uppercase tracking-[0.2em]"
                :loading="isSaving"
                @click="saveChanges(fund.id)"
              >
                Save Changes
              </AppButton>
            </div>
          </div>
        </div>

        <!-- View Mode -->
        <div
          v-else
          class="p-6"
        >
          <div class="flex items-start justify-between mb-6">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <p
                  class="text-sm font-black text-slate-900 tracking-tight uppercase leading-none max-w-[200px] truncate"
                  :title="fund.name"
                >
                  {{ fund.name }}
                </p>
                <button 
                  type="button"
                  class="text-violet-400 hover:text-violet-600 transition-colors"
                  title="Edit Fund"
                  @click="startEditing(fund)"
                >
                  <Pencil class="w-3 h-3" />
                </button>
              </div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                Fund Target
              </p>
            </div>
            <div class="text-right space-y-1.5">
              <div class="flex flex-col items-end gap-1.5">
                <p
                  v-for="t in fund.totals"
                  :key="t.currency"
                  class="text-sm font-black text-slate-900 italic tracking-tight leading-none"
                >
                  {{ formatCurrency(t.amount, t.currency) }}
                </p>
                <p
                  v-if="!fund.totals?.length"
                  class="text-sm font-black text-slate-900 italic leading-none"
                >
                  GHS 0.00
                </p>
              </div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                Raised Today
              </p>
            </div>
          </div>

          <div v-if="fund.targetAmount > 0">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress</span>
              <span class="text-[11px] font-black text-slate-900 tabular-nums">{{ calculateProgress(fund) }}%</span>
            </div>
            <div class="h-0.5 w-full bg-slate-50 overflow-hidden">
              <div 
                class="h-full bg-slate-900 group-hover:bg-violet-600 transition-all duration-1000"
                :style="{ width: `${calculateProgress(fund)}%` }"
              />
            </div>
          </div>
          <div 
            v-else 
            class="pt-6 border-t border-slate-50"
          >
            <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Open Target</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loader2, Pencil } from 'lucide-vue-next'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'
import { formatCurrency } from '@/core/formatting/formatters'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import { useToastStore } from '@/shared/stores/useToastStore'

const props = defineProps<{
  eventId: string
}>()

const funds = ref<RecipientFund[]>([])
const isLoading = ref(true)
const isError = ref(false)
const toast = useToastStore()

// Inline Editing State
const editingFundId = ref<string | null>(null)
const isSaving = ref(false)
const editForm = ref({
  name: '',
  description: '',
  targetAmount: 0,
  isActive: true
})

async function fetchFunds() {
  try {
    isLoading.value = true
    funds.value = await recipientFundsService.listByEvent(props.eventId)
  } catch (err) {
    console.error('Failed to fetch funds:', err)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchFunds()
})

function startEditing(fund: RecipientFund) {
  editingFundId.value = fund.id
  editForm.value = {
    name: fund.name,
    description: fund.description,
    targetAmount: fund.targetAmount,
    isActive: fund.isActive ?? true
  }
}

function cancelEditing() {
  editingFundId.value = null
}

async function saveChanges(fundId: string) {
  if (!editForm.value.name) return

  isSaving.value = true
  try {
    await recipientFundsService.update(fundId, {
      eventId: props.eventId,
      name: editForm.value.name,
      description: editForm.value.description || '',
      targetAmount: editForm.value.targetAmount,
      isActive: editForm.value.isActive
    })
    
    toast.success('Fund updated successfully')
    editingFundId.value = null
    await fetchFunds() // Refresh metrics
  } catch (err) {
    console.error('Failed to update fund:', err)
    toast.error('Failed to save changes')
  } finally {
    isSaving.value = false
  }
}

function calculateProgress(fund: RecipientFund) {
  if (!fund.targetAmount || !fund.totals?.length) return 0
  const ghsTotal = fund.totals.find(t => t.currency === 'GHS')?.amount ?? 0
  return Math.min(100, Math.round((ghsTotal / fund.targetAmount) * 100))
}
</script>
