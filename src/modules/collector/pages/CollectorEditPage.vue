<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Syncing collector record..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Sync Failed"
    :message="query.error.value?.message ?? 'Unknown error'"
    show-retry
    @retry="query.refetch"
  />
  <form v-else-if="form" @submit.prevent="handleSave">
    <AdminPageHeader
      :title="`Edit ${collector?.name}`"
      description="Manage collector identity, access scope, and operational limits."
    >
      <template #meta>
        <div class="flex items-center gap-4">
          <StatusBadge
            :status="form.status"
            :tone="form.status.toLowerCase() === 'active' ? 'success' : 'neutral'"
          />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Operational Management
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="!rounded-xl"
            @click="router.push({ name: 'admin-collectors' })"
          >
            Discard
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
    </AdminPageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 space-y-8">
        <!-- Identity -->
        <AppCard class="!p-8 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Identity Details</h3>
          <div class="grid md:grid-cols-2 gap-8">
            <AppInput v-model="form.name" label="Full Name" required />
            <AppInput v-model="form.email" label="Email Address" type="email" required />
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <AppInput v-model="form.phone" label="Phone Number" required />
            <AppSelect
              v-model="form.type"
              label="Role"
              :options="[
                { label: 'Collector', value: 'Collector' },
                { label: 'Lead Collector', value: 'Lead' },
                { label: 'Supervisor', value: 'Supervisor' }
              ]"
            />
          </div>
        </AppCard>

        <!-- Access -->
        <AppCard class="!p-8 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Field Access & Permissions</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <ToggleCard v-model="form.loginEnabled" title="Login Enabled" />
            <ToggleCard v-model="form.recordCash" title="Record Cash" />
            <ToggleCard v-model="form.issueReceipts" title="Issue Receipts" />
            <ToggleCard v-model="form.viewDashboard" title="View Dashboard" />
          </div>
        </AppCard>

        <!-- Assignments -->
        <AppCard class="!p-8 space-y-8">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Event Assignments</h3>
            <AppButton variant="outline" size="sm" class="!rounded-lg text-[10px]">Manage Assignments</AppButton>
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-center">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {{ collector?.assignedEventCount }} events currently assigned
            </p>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <!-- Status & Control -->
        <DetailSummaryCard title="Account Control" :items="[]">
          <div class="space-y-6">
            <AppSelect
              v-model="form.status"
              label="Current Status"
              :options="[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' }
              ]"
            />
            <div class="p-4 rounded-xl bg-amber-50 text-amber-800 text-[10px] font-medium leading-relaxed italic">
              Changes to status impact real-time mobile app access immediately.
            </div>
          </div>
        </DetailSummaryCard>

        <!-- Limits -->
        <AppCard class="!p-8 space-y-6 bg-slate-900 text-white shadow-premium">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">Operational Limits</h3>
          <div class="space-y-4">
            <AppInput 
              v-model="form.dailyLimit" 
              type="number" 
              label="Daily Limit" 
              class="!bg-white/5 !border-white/10 !text-white"
            />
            <AppInput 
              v-model="form.maxCashHolding" 
              type="number" 
              label="Max Holding" 
              class="!bg-white/5 !border-white/10 !text-white"
            />
          </div>
        </AppCard>

        <!-- Last Sync -->
        <AppCard class="!p-6 border-slate-100 bg-slate-50/30">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Last Sync</h4>
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity</span>
            <span class="text-[10px] font-black text-slate-900 tracking-tight">{{ collector?.lastActiveAt ? formatDate(collector.lastActiveAt) : 'Never' }}</span>
          </div>
        </AppCard>
      </div>
    </div>

    <StickyFormActions>
      <template #left>
        <span v-if="updateMutation.isPending.value" class="text-xs font-bold text-violet-600 animate-pulse">Syncing changes...</span>
      </template>
      <AppButton
        variant="outline"
        @click="router.push({ name: 'admin-collectors' })"
      >
        Discard
      </AppButton>
      <AppButton
        variant="primary"
        class="!rounded-xl shadow-premium px-12"
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
import { useCollector, useUpdateCollector } from '../composables/useCollectors'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import { formatDate } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()
const collectorId = computed(() => route.params.id as string)

const query = useCollector(collectorId.value)
const collector = computed(() => query.data.value)
const updateMutation = useUpdateCollector()

const form = ref<{
  name: string
  email: string
  phone: string
  type: string
  status: string
  loginEnabled: boolean
  recordCash: boolean
  issueReceipts: boolean
  viewDashboard: boolean
  dailyLimit: number
  maxCashHolding: number
} | null>(null)

watchEffect(() => {
  if (collector.value && !form.value) {
    form.value = {
      name: collector.value.name,
      email: collector.value.email,
      phone: (collector.value as any).phoneNumber || '',
      type: 'Collector',
      status: collector.value.status,
      loginEnabled: true,
      recordCash: true,
      issueReceipts: true,
      viewDashboard: true,
      dailyLimit: 2000,
      maxCashHolding: 1000
    }
  }
})

async function handleSave() {
  if (!form.value) return
  try {
    await updateMutation.mutateAsync({
      id: collectorId.value,
      payload: form.value
    })
    router.push({ name: 'admin-collectors' })
  } catch (err) {
    console.error('Failed to update collector:', err)
  }
}
</script>
