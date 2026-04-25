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
  <form
    v-else-if="form"
    @submit.prevent="handleSave"
  >
    <AdminPageHeader
      :title="`Edit ${collector?.name}`"
      description="Manage collector identity, access scope, and operational limits."
    >
      <template #meta>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200">
            <div 
              class="w-1.5 h-1.5 rounded-full"
              :class="form.status.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"
            />
            <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">{{ form.status }}</span>
          </div>
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Operational Management
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            class="bg-transparent border-slate-200"
            @click="router.push({ name: 'admin-collectors' })"
          >
            Discard
          </AppButton>
          <AppButton
            variant="primary"
            class="px-8"
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
        <!-- Identity -->
        <AppCard class="!p-10 space-y-10 border-slate-200">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Identity Details
          </h3>
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput
              v-model="form.name"
              label="Full Name"
              required
            />
            <AppInput
              v-model="form.email"
              label="Email Address"
              type="email"
              required
            />
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput
              v-model="form.phone"
              label="Phone Number"
              required
            />
            <AppSelect
              v-model="form.type"
              label="Staff Role"
              :options="[
                { label: 'Collector', value: 'Collector' },
                { label: 'Lead Collector', value: 'Lead' },
                { label: 'Supervisor', value: 'Supervisor' }
              ]"
            />
          </div>
        </AppCard>

        <!-- Access -->
        <AppCard class="!p-10 space-y-10 border-slate-200">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Field Access & Permissions
          </h3>
          <div class="grid md:grid-cols-2 gap-6">
            <ToggleCard
              v-model="form.loginEnabled"
              title="Mobile Login"
              description="Allow access to the collector application."
            />
            <ToggleCard
              v-model="form.recordCash"
              title="Cash Collection"
              description="Authorized to record physical cash payments."
            />
            <ToggleCard
              v-model="form.issueReceipts"
              title="Issue Receipts"
              description="Authorized to generate digital receipts."
            />
            <ToggleCard
              v-model="form.viewDashboard"
              title="View Insights"
              description="Access to personal performance metrics."
            />
          </div>
        </AppCard>

        <!-- Assignments -->
        <AppCard class="!p-10 space-y-10 border-slate-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Campaign Assignments
            </h3>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ form.eventIds.length }} Active Assignments</span>
          </div>
          
          <div class="space-y-6">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Select the campaigns this staff member is authorized to collect for:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="e in availableEvents" 
                :key="e.id"
                class="p-4 border border-slate-100 bg-slate-50/30 flex items-center justify-between group cursor-pointer hover:border-violet-200 transition-all"
                :class="{ '!border-violet-600 !bg-violet-50/50': isAssigned(e.id) }"
                @click="toggleAssignment(e.id)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-none bg-white border border-slate-200 flex items-center justify-center">
                    <Calendar class="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <span class="text-xs font-black text-slate-900 tracking-tight leading-none uppercase">{{ e.title }}</span>
                </div>
                <div 
                  class="w-4 h-4 border flex items-center justify-center transition-all"
                  :class="isAssigned(e.id) ? 'bg-violet-600 border-violet-600' : 'border-slate-300 bg-white'"
                >
                  <Check v-if="isAssigned(e.id)" class="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <div 
              v-if="availableEvents.length === 0"
              class="py-12 text-center border border-dashed border-slate-200"
            >
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No events available for assignment.</p>
            </div>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <!-- Status & Control -->
        <DetailSummaryCard
          title="Account Intelligence"
          :items="[]"
        >
          <div class="space-y-6">
            <AppSelect
              v-model="form.status"
              label="Staff Status"
              :options="[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' }
              ]"
            />
            <div class="p-6 bg-amber-50/50 border border-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest leading-relaxed italic">
              Status changes propagate to the field application in real-time.
            </div>
          </div>
        </DetailSummaryCard>

        <!-- Limits -->
        <AppCard class="!p-8 space-y-8 bg-slate-900 text-white shadow-xl">
          <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Financial Guardrails
          </h3>
          <div class="space-y-6">
            <AppInput 
              v-model="form.dailyLimit" 
              type="number" 
              label="Daily Limit" 
              class="!bg-white/5 !border-white/10 !text-white"
            >
              <template #prefix><span class="text-white/40 font-bold">GHS</span></template>
            </AppInput>
            <AppInput 
              v-model="form.maxCashHolding" 
              type="number" 
              label="Max Cash Holding" 
              class="!bg-white/5 !border-white/10 !text-white"
            >
              <template #prefix><span class="text-white/40 font-bold">GHS</span></template>
            </AppInput>
          </div>
        </AppCard>

        <!-- Last Sync -->
        <AppCard class="!p-8 border-slate-200 bg-white">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
            Operational Timestamp
          </h4>
          <div class="flex justify-between items-center py-2 border-b border-slate-50">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Activity</span>
            <span class="text-xs font-black text-slate-900 tracking-tight">{{ collector?.lastActiveAt ? formatDate(collector.lastActiveAt) : 'Never' }}</span>
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
          >Syncing with cloud...</span>
        </div>
      </template>
      <AppButton
        variant="outline"
        class="bg-transparent border-slate-200"
        @click="router.push({ name: 'admin-collectors' })"
      >
        Discard
      </AppButton>
      <AppButton
        variant="primary"
        class="px-16"
        type="submit"
        :loading="updateMutation.isPending.value"
      >
        Save Profile
      </AppButton>
    </StickyFormActions>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollector, useUpdateCollector } from '../composables/useCollectors'
import { useEvents } from '@/modules/events/composables/useEvents'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import { formatDate } from '@/core/formatting/formatters'
import { Check, Calendar } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const collectorId = computed(() => route.params.id as string)

const query = useCollector(collectorId.value)
const collector = computed(() => query.data.value)
const updateMutation = useUpdateCollector()

const eventQuery = useEvents()
const availableEvents = computed(() => eventQuery.data.value ?? [])

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
  eventIds: string[]
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
      maxCashHolding: 1000,
      eventIds: collector.value.eventIds || []
    }
  }
})

function isAssigned(id: string) {
  return form.value?.eventIds.includes(id)
}

function toggleAssignment(id: string) {
  if (!form.value) return
  const index = form.value.eventIds.indexOf(id)
  if (index > -1) {
    form.value.eventIds.splice(index, 1)
  } else {
    form.value.eventIds.push(id)
  }
}

async function handleSave() {
  if (!form.value) return
  try {
    await updateMutation.mutateAsync({
      id: collectorId.value,
      payload: form.value
    })
    toast.success('Collector profile and assignments updated')
    router.push({ name: 'admin-collectors' })
  } catch (err) {
    console.error('Failed to update collector:', err)
    toast.error('Failed to sync changes')
  }
}
</script>
