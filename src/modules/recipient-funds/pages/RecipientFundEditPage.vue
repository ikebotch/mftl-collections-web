<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Loading fund details..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Failed to load fund"
    :message="query.error.value?.message ?? 'Sync failed'"
    show-retry
    @retry="query.refetch"
  />
  <form
    v-else-if="form"
    class="space-y-10"
    @submit.prevent="handleSave"
  >
    <AdminPageHeader
      :title="`Edit ${fund?.name}`"
      description="Manage fund targets, visibility, and allocation settings."
    >
      <template #meta>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200">
            <div 
              class="w-1.5 h-1.5 rounded-full"
              :class="form.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
            />
            <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">{{ form.isActive ? 'Active' : 'Draft' }}</span>
          </div>
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Strategic Allocation
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="bg-transparent border-slate-200"
            @click="router.push({ name: 'admin-funds-detail', params: { id: fundId } })"
          >
            Discard
          </AppButton>
          <AppButton
            variant="primary"
            class="px-10"
            type="submit"
            :loading="updateMutation.isPending.value"
          >
            Save Changes
          </AppButton>
        </div>
      </template>
    </AdminPageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-32">
      <div class="lg:col-span-8 space-y-10">
        <!-- Fund Information -->
        <AppCard class="!p-10 space-y-10 border-slate-200">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Fund Definition
          </h3>
          <div class="space-y-8">
            <AppInput
              v-model="form.name"
              label="Fund Name"
              placeholder="e.g. Medical Supplies"
              required
            />
            <AppTextarea
              id="fund-description"
              v-model="form.description"
              label="Operational Purpose"
              placeholder="Describe the utilization of these funds..."
              :rows="5"
            />
          </div>
        </AppCard>

        <!-- Financial Targets -->
        <AppCard class="!p-10 space-y-10 border-slate-200">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Financial Guardrails
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AppInput
              v-model="form.targetAmount"
              type="number"
              label="Target Goal"
              placeholder="0.00"
              required
            >
              <template #prefix>
                <span class="text-slate-400 font-bold tracking-tighter">GHS</span>
              </template>
            </AppInput>
          </div>
          <div class="p-6 bg-slate-50 border border-slate-100">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">
              Conversion Note: Financial targets are tracked in GHS but support multi-currency contribution flows.
            </p>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <!-- Visibility -->
        <DetailSummaryCard 
          title="Lifecycle Management"
          :items="[]"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-white border border-slate-100">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">Fund Active</span>
              <AppSwitch v-model="form.isActive" />
            </div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">
              Inactive funds are restricted from receiving new contributions.
            </p>
          </div>
        </DetailSummaryCard>

        <!-- Audit Meta -->
        <AppCard class="!p-8 border-slate-200 bg-white">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
            System Metadata
          </h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-slate-50">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identifier</span>
              <span class="text-[9px] font-mono text-slate-500 uppercase">{{ fundId.split('-')[0] }}...</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Modified</span>
              <span class="text-[9px] font-black text-slate-900 tracking-tight uppercase">Today</span>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <StickyFormActions>
      <template #left>
        <div class="flex items-center gap-2">
          <div 
            v-if="updateMutation.isPending.value"
            class="w-2 h-2 rounded-full bg-violet-600 animate-pulse"
          />
          <span
            v-if="updateMutation.isPending.value"
            class="text-[10px] font-black text-violet-600 uppercase tracking-widest"
          >
            Syncing record...
          </span>
        </div>
      </template>
      <AppButton
        variant="outline"
        class="bg-transparent border-slate-200"
        @click="router.push({ name: 'admin-funds-detail', params: { id: fundId } })"
      >
        Discard
      </AppButton>
      <AppButton
        variant="primary"
        class="px-12"
        type="submit"
        :loading="updateMutation.isPending.value"
      >
        Save Changes
      </AppButton>
    </StickyFormActions>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipientFund, useUpdateRecipientFund } from '../composables/useRecipientFunds'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const fundId = computed(() => route.params.id as string)

const query = useRecipientFund(fundId.value)
const fund = computed(() => query.data.value)
const updateMutation = useUpdateRecipientFund()

const form = ref<{
  name: string
  description: string
  targetAmount: number
  isActive: boolean
} | null>(null)

watchEffect(() => {
  if (fund.value && !form.value) {
    form.value = {
      name: fund.value.name,
      description: fund.value.description || '',
      targetAmount: fund.value.targetAmount,
      isActive: true
    }
  }
})

async function handleSave() {
  if (!form.value) return
  
  try {
    await updateMutation.mutateAsync({
      id: fundId.value,
      payload: {
        eventId: fund.value!.eventId,
        name: form.value.name,
        description: form.value.description,
        targetAmount: form.value.targetAmount
      }
    })
    toast.success('Fund details synchronized successfully')
    router.push({ name: 'admin-funds-detail', params: { id: fundId.value } })
  } catch (err) {
    console.error('Failed to update fund:', err)
    toast.error('Failed to update fund')
  }
}
</script>
