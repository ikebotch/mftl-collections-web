<template>
  <div class="space-y-10">
    <AdminPageHeader
      title="Settings"
      description="Manage organization profile, branding, and system-wide configurations."
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
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Branding & Identity</h3>
            <div class="flex items-center gap-8">
              <div class="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-3xl font-black">
                M
              </div>
              <div class="space-y-3">
                <AppButton variant="outline" size="sm" class="!rounded-lg text-[10px]">Change Logo</AppButton>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended size: 512x512px. PNG or SVG.</p>
              </div>
            </div>
          </section>
        </AppCard>

        <AppCard class="!p-10 space-y-8">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Regional & Financial</h3>
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
              label="Timezone" 
              :model-value="'GMT'"
              :options="[{ label: 'Greenwich Mean Time (GMT)', value: 'GMT' }]"
            />
          </div>
        </AppCard>

        <AppCard class="!p-10 space-y-6">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Environment & Developers</h3>
          <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput label="API Base URL (Dev)" :model-value="'http://localhost:7071/api/v1'" disabled />
              <AppInput label="Public Storefront URL" :model-value="'http://localhost:5173/give'" disabled />
            </div>
            <div class="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div class="space-y-1">
                <p class="text-xs font-black text-slate-900 uppercase tracking-tight italic">Auth0 / Dev Bypass</p>
                <p class="text-[10px] text-slate-500 font-medium">Currently using X-Dev-User-Id header for local development.</p>
              </div>
              <StatusBadge status="Active" tone="success" />
            </div>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <DetailSummaryCard title="Payment Configuration" :items="[]">
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
            <AppButton variant="outline" class="w-full !rounded-xl">Manage Gateways</AppButton>
          </div>
        </DetailSummaryCard>

        <AppCard class="!p-8 space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Preferences</h3>
          <div class="space-y-4">
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
import { useTenantSettings } from '../composables/useTenantSettings'
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
