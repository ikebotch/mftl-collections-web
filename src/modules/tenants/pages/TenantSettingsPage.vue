<template>
  <div class="space-y-10">
    <AdminPageHeader
      :title="copy.admin.pages.settings.title"
      :description="copy.admin.pages.settings.description"
    />

    <div
      v-if="query.isLoading.value"
      class="py-32"
    >
      <LoadingState text="Fetching configuration..." />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 space-y-8">
        <AppCard class="!p-10 space-y-10">
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Organization Profile</h3>
              <div class="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID:</span>
                <span class="text-[9px] font-black text-slate-900 font-mono">{{ tenantId }}</span>
                <button @click="copyTenantId" class="text-slate-400 hover:text-violet-600 transition-colors">
                  <Copy class="w-3 h-3" />
                </button>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput label="Organization Name" :model-value="'MFTL Foundation'" />
              <AppInput label="Support Email" :model-value="'support@mftl.com'" />
            </div>
            <AppTextarea id="mission" label="Bio / Mission" :rows="3" :model-value="'Empowering communities through transparent collection and efficient resource allocation.'" />
          </section>

          <section class="space-y-6 pt-10 border-t border-slate-100">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Branding & Receipts</h3>
            <div class="grid md:grid-cols-2 gap-10">
              <div class="space-y-4">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Logo</p>
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black">
                    M
                  </div>
                  <AppButton variant="outline" size="sm" class="!rounded-lg text-[9px] font-black uppercase tracking-widest">Upload</AppButton>
                </div>
              </div>
              <div class="space-y-4">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Receipt/POS Logo</p>
                <div class="flex items-center gap-6">
                  <div class="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-200 text-xl font-black italic">
                    POS
                  </div>
                  <AppButton variant="outline" size="sm" class="!rounded-lg text-[9px] font-black uppercase tracking-widest">Upload</AppButton>
                </div>
              </div>
            </div>
          </section>
        </AppCard>

        <AppCard class="!p-10 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Regional & Localisation</h3>
          <div class="grid md:grid-cols-2 gap-10">
            <AppSelect 
              label="Primary Currency" 
              :model-value="'GHS'"
              :options="[
                { label: 'Ghana Cedi (GHS)', value: 'GHS' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'British Pound (GBP)', value: 'GBP' }
              ]"
            />
            <AppSelect 
              label="Default Locale" 
              :model-value="'en-GH'"
              :options="[
                { label: 'English (Ghana)', value: 'en-GH' },
                { label: 'English (Global)', value: 'en-US' },
                { label: 'French', value: 'fr' },
                { label: 'Spanish', value: 'es' }
              ]"
            />
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-black text-slate-900 uppercase tracking-tight italic">Multi-Currency Collection</p>
              <p class="text-[10px] text-slate-500 font-medium">Allow donors to choose between GHS, USD, and GBP at checkout.</p>
            </div>
            <div class="flex gap-2">
              <span class="px-2 py-0.5 rounded bg-violet-100 text-violet-600 text-[9px] font-black uppercase tracking-widest">GHS</span>
              <span class="px-2 py-0.5 rounded bg-violet-100 text-violet-600 text-[9px] font-black uppercase tracking-widest">USD</span>
            </div>
          </div>
        </AppCard>

        <AppCard class="!p-10 space-y-6">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Environment & Network</h3>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput label="API Base URL (Dev)" :model-value="'http://localhost:7071/api/v1'" disabled />
              <AppInput label="Public Storefront URL" :model-value="'http://localhost:5173/give'" disabled />
            </div>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <DetailSummaryCard title="Live Configuration" :items="[]">
          <div class="space-y-6">
            <div class="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center gap-4">
              <div class="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <Check class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm font-black text-slate-900 italic uppercase">Paystack Active</p>
                <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Mode: Live</p>
              </div>
            </div>
            <div class="space-y-3">
              <AppButton variant="primary" class="w-full !rounded-xl shadow-premium">Save Changes</AppButton>
              <AppButton variant="outline" class="w-full !rounded-xl">Manage Gateways</AppButton>
            </div>
          </div>
        </DetailSummaryCard>

        <AppCard class="!p-8 space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Developer Mode</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div class="space-y-0.5">
                <p class="text-[10px] font-black text-slate-900 uppercase">Auth0 Bypass</p>
                <p class="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active in Dev</p>
              </div>
              <div class="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <ToggleCard title="Maintenance Mode" description="Block all field activities." :model-value="false" />
            <ToggleCard title="Public Leaderboard" description="Show top collectors." :model-value="true" />
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCopy } from '@/core/i18n/useCopy'
import { useTenantSettings } from '../composables/useTenantSettings'

const { copy } = useCopy()
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { Check, Copy } from 'lucide-vue-next'

const query = useTenantSettings()
const tenantId = ref('tenant_mftl_001')

function copyTenantId() {
  navigator.clipboard.writeText(tenantId.value)
}
</script>
