<template>
  <div class="min-h-screen bg-slate-50/50 pb-32">
    <!-- Centered Header Area -->
    <div class="max-w-[1200px] mx-auto pt-16 pb-12 px-8">
      <header class="mb-16">
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4">
          Add Collector
        </h1>
        <p class="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
          Create field collector access, assign collection scope, and set operational limits.
        </p>
      </header>

      <AdminWizardLayout 
        :sections="steps" 
        title="Collector Setup"
      >
        <!-- Step 1: Identity -->
        <AppCard 
          id="section-identity"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 01
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Personal Identity
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.name"
                label="Full Name"
                placeholder="e.g. John Doe"
                required
              />
              <AppInput
                v-model="form.email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.phone"
                label="Phone Number"
                placeholder="+233..."
                required
              />
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
            <AppTextarea
              id="collector-notes"
              v-model="form.notes"
              label="Administrative Notes"
              placeholder="Internal notes about this collector..."
              :rows="3"
            />
          </div>
        </AppCard>

        <!-- Step 2: Access & Permissions -->
        <AppCard 
          id="section-access"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 02
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Access & Permissions
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                System Authentication
              </h4>
              <div class="space-y-4">
                <ToggleCard
                  v-model="form.loginEnabled"
                  title="Mobile Login"
                  description="Allow collector to sign in to the field app."
                />
                <ToggleCard
                  v-model="form.sendInvite"
                  title="Send Invite Email"
                  description="Automatically trigger the Auth0 onboarding flow."
                />
              </div>
            </div>
            <div class="space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Field Privileges
              </h4>
              <div class="space-y-4">
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
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Step 3: Operational Limits -->
        <AppCard 
          id="section-limits"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 03
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Operational Limits
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.dailyLimit"
                type="number"
                label="Daily Collection Limit"
                placeholder="0.00"
              >
                <template #prefix>
                  <span class="text-slate-400 font-bold">GHS</span>
                </template>
              </AppInput>
              <AppInput
                v-model="form.maxCashHolding"
                type="number"
                label="Max Cash Holding"
                placeholder="0.00"
              >
                <template #prefix>
                  <span class="text-slate-400 font-bold">GHS</span>
                </template>
              </AppInput>
            </div>
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.approvalThreshold"
                type="number"
                label="Approval Threshold"
                placeholder="0.00"
              >
                <template #prefix>
                  <span class="text-slate-400 font-bold">GHS</span>
                </template>
              </AppInput>
              <AppSelect
                v-model="form.region"
                label="Assigned Region"
                :options="[
                  { label: 'Accra Central', value: 'Accra Central' },
                  { label: 'Kumasi Metropolitan', value: 'Kumasi' },
                  { label: 'Northern Territory', value: 'North' }
                ]"
              />
            </div>
          </div>
        </AppCard>

        <!-- Step 4: Assignment Strategy -->
        <AppCard 
          id="section-assignment"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-8">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 04
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Campaign Assignment
            </h2>
          </div>

          <div class="p-8 border border-slate-200 bg-slate-50 flex gap-6 items-start">
            <Info class="w-6 h-6 text-slate-400 shrink-0 mt-1" />
            <div class="space-y-2">
              <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                Deferred Assignment Strategy
              </p>
              <p class="text-xs text-slate-500 font-medium leading-relaxed italic">
                Assignments to specific campaigns and funds are configured after the collector profile is created. 
                You will be redirected to the assignment manager once published.
              </p>
            </div>
          </div>
        </AppCard>
      </AdminWizardLayout>
    </div>

    <!-- Sticky Bottom Bar -->
    <StickyFormActions>
      <template #left>
        <AppButton 
          variant="outline" 
          @click="router.push({ name: 'admin-collectors' })"
        >
          Cancel
        </AppButton>
      </template>
      
      <div class="flex gap-4">
        <AppButton 
          variant="outline"
          :loading="isSubmitting"
          @click="handleSubmit('Draft')"
        >
          Save Draft
        </AppButton>
        <AppButton 
          variant="primary" 
          class="px-12"
          :loading="isSubmitting"
          @click="handleSubmit('Active')"
        >
          Create Collector
        </AppButton>
      </div>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateCollector } from '../composables/useCollectors'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import { Info } from 'lucide-vue-next'

const router = useRouter()
const toast = useToastStore()
const mutation = useCreateCollector()
const isSubmitting = computed(() => mutation.isPending.value)

const steps = [
  { id: 'section-identity', title: 'Identity', subtitle: 'Profile Details' },
  { id: 'section-access', title: 'Access', subtitle: 'Permissions' },
  { id: 'section-limits', title: 'Limits', subtitle: 'Financial Bounds' },
  { id: 'section-assignment', title: 'Assignment', subtitle: 'Campaign Scope' },
]

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
  region: 'Accra Central',
  dailyLimit: 2000,
  maxCashHolding: 1000,
  approvalThreshold: 500,
})

async function handleSubmit(finalStatus: string) {
  if (!form.name || !form.email) {
    toast.error('Please complete the collector identity information')
    return
  }

  try {
    const payload = {
      ...form,
      status: finalStatus,
      metadata: JSON.stringify({
        notes: form.notes,
        region: form.region,
        permissions: {
          login: form.loginEnabled,
          cash: form.recordCash,
          receipts: form.issueReceipts,
        }
      })
    }
    
    await mutation.mutateAsync(payload)
    toast.success('Collector profile created successfully')
    router.push({ name: 'admin-collectors' })
  } catch (err: any) {
    console.error('Failed to create collector:', err)
    toast.error(err.message || 'Failed to create collector')
  }
}
</script>
