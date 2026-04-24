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
    <DetailPageHeader
      :title="`Edit ${fund?.name}`"
      description="Manage fund targets, visibility, and allocation settings."
      :back-to="{ name: 'admin-funds-detail', params: { id: fundId } }"
    >
      <template #meta>
        <div class="flex items-center gap-4">
          <StatusBadge
            :status="form.isActive ? 'active' : 'draft'"
            :tone="form.isActive ? 'success' : 'neutral'"
          />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Editing operational fund
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="router.push({ name: 'admin-funds-detail', params: { id: fundId } })"
          >
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            class="!rounded-xl shadow-premium"
            type="submit"
            :loading="updateMutation.isPending.value"
          >
            Save Changes
          </AppButton>
        </div>
      </template>
    </DetailPageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 space-y-8">
        <AppCard class="!p-8 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Fund Information
          </h3>
          <div class="space-y-6">
            <AppInput
              v-model="form.name"
              label="Fund Name"
              placeholder="e.g. Medical Supplies"
              required
            />
            <AppTextarea
              id="fund-description"
              v-model="form.description"
              label="Description"
              placeholder="What will these contributions be used for?"
              :rows="5"
            />
          </div>
        </AppCard>

        <AppCard class="!p-8 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Target & Currency
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AppInput
              v-model="form.targetAmount"
              type="number"
              label="Target Amount"
              placeholder="0.00"
              required
            >
              <template #prefix>
                <span class="text-slate-400 font-bold">GHS</span>
              </template>
            </AppInput>
          </div>
          <p class="text-[10px] text-slate-400 font-medium leading-relaxed italic">
            Currency conversion is handled at the transaction level based on the event's primary currency.
          </p>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <DetailSummaryCard 
          title="Visibility"
          :items="[]"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">Fund Active</span>
              <AppSwitch v-model="form.isActive" />
            </div>
            <p class="text-[10px] text-slate-400 italic leading-relaxed">
              When inactive, this fund will no longer appear as an option for new contributions.
            </p>
          </div>
        </DetailSummaryCard>

        <AppCard class="!p-6 border-slate-100 bg-slate-50/30">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            Operational Info
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fund ID</span>
              <span class="text-[9px] font-mono text-slate-500">{{ fundId.split('-')[0] }}...</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</span>
              <span class="text-[9px] font-black text-slate-900 tracking-tight">Today</span>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <StickyFormActions>
      <template #left>
        <span
          v-if="updateMutation.isPending.value"
          class="text-xs font-bold text-violet-600 animate-pulse"
        >
          Updating record...
        </span>
      </template>
      <AppButton
        variant="outline"
        @click="router.push({ name: 'admin-funds-detail', params: { id: fundId } })"
      >
        Discard
      </AppButton>
      <AppButton
        variant="primary"
        class="!rounded-xl shadow-premium px-10"
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
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'

const route = useRoute()
const router = useRouter()
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
      isActive: true // Fallback since we don't have this in DTO yet
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
    router.push({ name: 'admin-funds-detail', params: { id: fundId.value } })
  } catch (err) {
    console.error('Failed to update fund:', err)
  }
}
</script>
