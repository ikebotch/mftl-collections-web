<template>
  <div class="min-h-screen bg-slate-50/50 pb-32">
    <!-- Header -->
    <div class="max-w-[1200px] mx-auto pt-16 pb-12 px-8">
      <header class="mb-16">
        <div class="flex items-center gap-4 mb-6">
          <AppButton
            variant="ghost"
            size="sm"
            class="text-slate-400"
            @click="router.push('/admin/organization')"
          >
            <ArrowLeft class="w-4 h-4 mr-2" /> Back to Network
          </AppButton>
        </div>
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4">
          Initialize New Organization
        </h1>
        <p class="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
          Onboard a new collection node to the global ecosystem. Define its identity, localization parameters, and support channels.
        </p>
      </header>

      <AdminWizardLayout
        :sections="steps"
        title="Configuration Matrix"
      >
        <!-- Step 1: Identity -->
        <AppCard
          id="section-identity"
          class="!p-10 scroll-mt-10 border-slate-200"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 01
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Core Identity
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.name"
                label="Organization Name"
                placeholder="e.g. MFTL Foundation"
                required
                @input="syncIdentifier"
              />
              <AppInput
                v-model="form.supportEmail"
                label="Support Email"
                placeholder="e.g. support@mftl.com"
                type="email"
              />
            </div>
            
            <AppInput
              v-model="form.identifier"
              label="Network Identifier"
              placeholder="e.g. mftl-foundation"
              required
            >
              <template #help>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
                  Used for subdomain isolation and system-wide routing. This cannot be changed later.
                </p>
              </template>
            </AppInput>

            <AppTextarea
              v-model="form.missionStatement"
              label="Mission Statement"
              placeholder="Define the purpose of this node..."
              :rows="4"
            />
          </div>
        </AppCard>

        <!-- Step 2: Regional -->
        <AppCard
          id="section-regional"
          class="!p-10 scroll-mt-10 border-slate-200"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 02
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Regional Parameters
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-10">
            <AppSelect
              v-model="form.defaultCurrency"
              label="Operational Currency"
              :options="[
                { label: 'Ghana Cedi (GHS)', value: 'GHS' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'British Pound (GBP)', value: 'GBP' }
              ]"
            />
            <AppSelect
              v-model="form.defaultLocale"
              label="System Locale"
              :options="[
                { label: 'English (Ghana)', value: 'en-GH' },
                { label: 'English (Global)', value: 'en-US' }
              ]"
            />
          </div>

          <div class="p-8 bg-violet-50/30 border border-violet-100 flex items-start gap-5 mt-12">
            <div class="w-10 h-10 bg-white border border-violet-200 flex items-center justify-center">
              <Globe class="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">
                Localization Sync
              </p>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                These defaults will be inherited by all branches and events created within this organization.
              </p>
            </div>
          </div>
        </AppCard>

        <!-- Step 3: Administration -->
        <AppCard
          id="section-admin"
          class="!p-10 scroll-mt-10 border-slate-200"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 03
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Administration Onboarding
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.adminName"
                label="Administrator Name"
                placeholder="e.g. John Doe"
                required
              />
              <AppInput
                v-model="form.adminEmail"
                label="Administrator Email"
                placeholder="e.g. admin@organization.com"
                type="email"
                required
              />
            </div>

            <div class="p-8 bg-emerald-50/30 border border-emerald-100 flex items-start gap-5">
              <div class="w-10 h-10 bg-white border border-emerald-200 flex items-center justify-center">
                <ShieldCheck class="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">
                  Administrative Privilege
                </p>
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                  This user will be granted the 'TenantAdmin' role. If they don't have an account, an invitation will be initialized.
                </p>
              </div>
            </div>
          </div>
        </AppCard>
      </AdminWizardLayout>
    </div>

    <!-- Sticky Actions -->
    <StickyFormActions>
      <template #left>
        <AppButton
          variant="outline"
          @click="router.push('/admin/organization')"
        >
          Cancel
        </AppButton>
      </template>

      <AppButton
        variant="primary"
        class="px-12 shadow-lg shadow-violet-100"
        :loading="createMutation.isPending.value"
        @click="submit"
      >
        Register Organization
      </AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateTenant } from '../composables/useTenants'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import { ArrowLeft, Globe, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const toast = useToastStore()
const createMutation = useCreateTenant()

const steps = [
  { id: 'section-identity', title: 'Identity', subtitle: 'Namespace & Profile' },
  { id: 'section-regional', title: 'Regional', subtitle: 'Currency & Locale' },
  { id: 'section-admin', title: 'Administration', subtitle: 'Onboard Primary Admin' }
]

const form = reactive({
  name: '',
  identifier: '',
  supportEmail: '',
  missionStatement: '',
  defaultCurrency: 'GHS',
  defaultLocale: 'en-GH',
  adminEmail: '',
  adminName: ''
})

function syncIdentifier() {
  if (!form.identifier || form.identifier === form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
    form.identifier = form.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }
}

async function submit() {
  if (!form.name || !form.identifier || !form.adminEmail || !form.adminName) {
    toast.error('Please complete all required fields, including the Primary Administrator')
    return
  }

  try {
    const id = await createMutation.mutateAsync(form)
    toast.success('Organization registered successfully')
    router.push(`/admin/organization/${id}`)
  } catch (error) {
    toast.error('Failed to register organization')
  }
}
</script>
