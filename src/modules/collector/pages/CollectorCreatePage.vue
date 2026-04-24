<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <header class="text-center mb-12">
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4">
        Add Collector
      </h1>
      <p class="text-slate-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">
        Create field collector access and assign collection scope.
      </p>
    </header>

    <div class="mb-12">
      <StepIndicator
        :steps="['Details', 'Access', 'Assignments', 'Limits', 'Review']"
        :current-step="currentStep"
      />
    </div>

    <form @submit.prevent="handleSubmit">
      <AppCard class="shadow-premium border-none !p-12 bg-white rounded-[2rem] min-h-[400px]">
        <!-- Step 1: Details -->
        <div v-if="currentStep === 1" class="space-y-10">
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput v-model="form.name" label="Full Name" placeholder="e.g. John Doe" required />
            <AppInput v-model="form.email" label="Email Address" type="email" placeholder="john@example.com" required />
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput v-model="form.phone" label="Phone Number" placeholder="+233..." required />
            <AppSelect
              v-model="form.type"
              label="Collector Type"
              :options="[
                { label: 'Collector', value: 'Collector' },
                { label: 'Lead Collector', value: 'Lead' },
                { label: 'Supervisor', value: 'Supervisor' }
              ]"
            />
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <AppSelect
              v-model="form.status"
              label="Initial Status"
              :options="[
                { label: 'Invited', value: 'Invited' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' }
              ]"
            />
          </div>
          <AppTextarea id="collector-notes" v-model="form.notes" label="Notes" placeholder="Optional notes about this collector..." :rows="3" />
        </div>

        <!-- Step 2: Access & Permissions -->
        <div v-if="currentStep === 2" class="space-y-8">
          <div class="space-y-4">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">System Access</h3>
            <div class="grid gap-4">
              <ToggleCard v-model="form.loginEnabled" title="Login Enabled" description="Allow collector to sign in to the mobile app." />
              <ToggleCard v-model="form.sendInvite" title="Send Auth0 Invite" description="Automatically send an email invite to set up credentials." />
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Field Permissions</h3>
            <div class="grid gap-4">
              <ToggleCard v-model="form.recordCash" title="Record Cash Contributions" description="Can accept and record physical cash." />
              <ToggleCard v-model="form.issueReceipts" title="Issue Receipts" description="Can generate and send digital receipts." />
              <ToggleCard v-model="form.viewDashboard" title="View Assigned Dashboard" description="Can see personal performance metrics." />
              <ToggleCard v-model="form.viewReports" title="View Assigned Reports" description="Access to historical collection data." />
            </div>
          </div>
        </div>

        <!-- Step 3: Assignments -->
        <div v-if="currentStep === 3" class="space-y-10">
          <div class="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
            <Info class="w-5 h-5 text-amber-600 shrink-0" />
            <p class="text-xs text-amber-900 font-medium leading-relaxed">
              Assignments to specific campaigns and funds will be configured in the Post-Provisioning stage. 
              Deferred assignment strategy active.
            </p>
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput v-model="form.region" label="Region/Location" placeholder="e.g. Accra Central" />
          </div>
        </div>

        <!-- Step 4: Device & Limits -->
        <div v-if="currentStep === 4" class="space-y-10">
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput v-model="form.deviceName" label="Device Name" placeholder="e.g. Samsung A54" />
            <AppInput v-model="form.deviceId" label="Device ID (Serial)" placeholder="Optional" />
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput v-model="form.dailyLimit" type="number" label="Daily Collection Limit" placeholder="0.00">
              <template #prefix><span class="text-slate-400 font-bold">GHS</span></template>
            </AppInput>
            <AppInput v-model="form.maxCashHolding" type="number" label="Max Cash Holding Limit" placeholder="0.00">
              <template #prefix><span class="text-slate-400 font-bold">GHS</span></template>
            </AppInput>
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput v-model="form.approvalThreshold" type="number" label="Supervisor Approval Threshold" placeholder="0.00">
              <template #prefix><span class="text-slate-400 font-bold">GHS</span></template>
            </AppInput>
            <div class="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50">
              <span class="text-sm font-bold text-slate-700">Offline Allowed</span>
              <AppSwitch v-model="form.offlineAllowed" />
            </div>
          </div>
        </div>

        <!-- Step 5: Review -->
        <div v-if="currentStep === 5" class="space-y-10">
          <section class="p-8 rounded-[2rem] bg-slate-900 text-white flex items-center gap-6 shadow-premium">
            <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black">
              {{ form.name.charAt(0) }}
            </div>
            <div>
              <p class="text-2xl font-black tracking-tight">{{ form.name }}</p>
              <p class="text-slate-400 font-medium uppercase tracking-widest text-[10px] mt-1">{{ form.type }} • {{ form.status }}</p>
            </div>
          </section>

          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity & Access</h4>
              <div class="space-y-2">
                <p class="text-sm font-bold text-slate-900">{{ form.email }}</p>
                <p class="text-sm font-bold text-slate-900">{{ form.phone }}</p>
                <div class="flex gap-2 mt-4">
                  <StatusBadge v-if="form.loginEnabled" status="Login" variant="success" />
                  <StatusBadge v-if="form.recordCash" status="Cash" variant="neutral" />
                  <StatusBadge v-if="form.issueReceipts" status="Receipts" variant="neutral" />
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Limits & Security</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-slate-500">Daily Limit</span>
                  <span class="text-xs font-black text-slate-900">{{ formatCurrency(form.dailyLimit, 'GHS') }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-slate-500">Max Holding</span>
                  <span class="text-xs font-black text-slate-900">{{ formatCurrency(form.maxCashHolding, 'GHS') }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-slate-500">Approval Threshold</span>
                  <span class="text-xs font-black text-slate-900">{{ formatCurrency(form.approvalThreshold, 'GHS') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppCard>

      <StickyFormActions>
        <template #left>
          <AppButton 
            v-if="currentStep > 1"
            variant="outline" 
            class="!rounded-xl"
            @click="currentStep--"
          >
            Back
          </AppButton>
          <AppButton 
            v-else
            variant="outline" 
            class="!rounded-xl"
            @click="router.push({ name: 'admin-collectors' })"
          >
            Cancel
          </AppButton>
        </template>
        
        <AppButton 
          v-if="currentStep < 5"
          variant="primary" 
          class="!rounded-xl shadow-premium px-12"
          @click="currentStep++"
        >
          Continue
        </AppButton>
        <div v-else class="flex gap-3">
          <AppButton 
            variant="outline"
            class="!rounded-xl"
            :loading="isSubmitting"
            @click="handleSubmit('Draft')"
          >
            Save Draft
          </AppButton>
          <AppButton 
            variant="primary" 
            class="!rounded-xl shadow-premium px-10"
            :loading="isSubmitting"
            @click="handleSubmit('Active')"
          >
            Create Collector
          </AppButton>
        </div>
      </StickyFormActions>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateCollector } from '../composables/useCollectors'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import StepIndicator from '@/shared/components/steppers/StepIndicator.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { Info } from 'lucide-vue-next'

const router = useRouter()
const currentStep = ref(1)
const mutation = useCreateCollector()
const isSubmitting = computed(() => mutation.isPending.value)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  type: 'Collector',
  status: 'Invited',
  notes: '',
  loginEnabled: true,
  sendInvite: true,
  recordCash: true,
  issueReceipts: true,
  viewDashboard: true,
  viewReports: false,
  region: '',
  deviceName: '',
  deviceId: '',
  dailyLimit: 2000,
  maxCashHolding: 1000,
  approvalThreshold: 500,
  offlineAllowed: false
})

async function handleSubmit(finalStatus?: string | SubmitEvent) {
  try {
    const status = typeof finalStatus === 'string' ? finalStatus : form.status
    const payload = {
      ...form,
      status,
      metadata: JSON.stringify({
        notes: form.notes,
        region: form.region,
        device: { name: form.deviceName, id: form.deviceId },
        permissions: {
          login: form.loginEnabled,
          cash: form.recordCash,
          receipts: form.issueReceipts,
          dashboard: form.viewDashboard,
          reports: form.viewReports
        }
      })
    }
    
    await mutation.mutateAsync(payload)
    router.push({ name: 'admin-collectors' })
  } catch (err) {
    console.error('Failed to create collector:', err)
  }
}
</script>
