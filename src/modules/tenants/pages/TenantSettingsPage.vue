<template>
  <div class="space-y-12 pb-32">
    <AdminPageHeader
      title="Global Configuration"
      description="Manage organization identity, localization parameters, and system-wide operational switches."
    />

    <div
      v-if="query.isLoading.value"
      class="py-32"
    >
      <LoadingState text="Syncing configuration matrix..." />
    </div>

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      <div class="lg:col-span-8 space-y-10">
        <!-- Organization Identity -->
        <AppCard class="!p-10 space-y-10 border-slate-200">
          <section class="space-y-8">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Organization Intelligence
              </h3>
              <div class="flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-200 group">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global ID:</span>
                <span class="text-[9px] font-black text-slate-900 font-mono tracking-tighter">{{ tenantId }}</span>
                <button
                  class="text-slate-400 hover:text-violet-600 transition-colors ml-1"
                  title="Copy Identifier"
                  @click="copyTenantId"
                >
                  <CopyIcon class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="orgName"
                label="Organization Name"
                placeholder="MFTL Foundation"
              />
              <AppInput
                v-model="supportEmail"
                label="Support Email"
                placeholder="support@mftl.com"
              />
            </div>
            
            <AppTextarea
              id="mission-statement"
              label="Mission Statement"
              placeholder="Define your organizational purpose..."
              :rows="4"
              :model-value="'Empowering communities through transparent collection and efficient resource allocation.'"
            />
          </section>

          <section class="space-y-8 pt-12 border-t border-slate-100">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Media & Branding Assets
            </h3>
            <div class="grid md:grid-cols-2 gap-12">
              <ModernImageInput 
                v-model="systemLogoProxy"
                label="Primary Brand Logo"
                :icon="ImageIcon"
              />
              <ModernImageInput 
                v-model="posLogoProxy"
                label="Receipt / POS Branding"
                :icon="Printer"
              />
            </div>
          </section>
        </AppCard>

        <!-- Regional Parameters -->
        <AppCard class="!p-10 space-y-10 border-slate-200">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Localization Parameters
          </h3>
          <div class="grid md:grid-cols-2 gap-10">
            <AppSelect 
              label="Operational Currency" 
              :model-value="'GHS'"
              :options="[
                { label: 'Ghana Cedi (GHS)', value: 'GHS' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'British Pound (GBP)', value: 'GBP' }
              ]"
            />
            <AppSelect 
              label="System Locale" 
              :model-value="'en-GH'"
              :options="[
                { label: 'English (Ghana)', value: 'en-GH' },
                { label: 'English (Global)', value: 'en-US' }
              ]"
            />
          </div>
          <div class="p-8 bg-violet-50/30 border border-violet-100 flex items-center justify-between">
            <div class="space-y-1.5">
              <p class="text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none">
                Multi-Currency Stream
              </p>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Authorized contribution flows across supported financial channels.
              </p>
            </div>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-white border border-violet-200 text-violet-600 text-[9px] font-black uppercase tracking-widest">GHS</span>
              <span class="px-3 py-1 bg-white border border-violet-200 text-violet-600 text-[9px] font-black uppercase tracking-widest">USD</span>
            </div>
          </div>
        </AppCard>

        <!-- Network Topology -->
        <AppCard class="!p-10 space-y-8 border-slate-200">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Network Topology
          </h3>
          <div class="space-y-8">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                label="Operational API Endpoint"
                :model-value="'https://api.mftl.com/v1'"
                disabled
              />
              <AppInput
                label="Secure Storefront URL"
                :model-value="'https://give.mftl.com'"
                disabled
              />
            </div>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-4 space-y-10">
        <!-- Live Status -->
        <DetailSummaryCard
          title="Live Operational State"
          :items="[]"
        >
          <div class="space-y-8">
            <div class="p-6 bg-emerald-50 border border-emerald-100 flex items-center gap-5">
              <div class="w-12 h-12 rounded-none bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <Check class="w-7 h-7" />
              </div>
              <div>
                <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">
                  Gateway: Paystack
                </p>
                <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1.5 leading-none">
                  Operational: Live Mode
                </p>
              </div>
            </div>
            
            <div class="space-y-4">
              <AppButton
                variant="primary"
                class="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em]"
                @click="saveConfiguration"
              >
                Save Configuration
              </AppButton>
              <AppButton
                variant="outline"
                class="w-full bg-transparent border-slate-200 py-4 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Manage Gateways
              </AppButton>
            </div>
          </div>
        </DetailSummaryCard>

        <!-- System Switches -->
        <AppCard class="!p-8 space-y-8 border-slate-200 bg-white">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Operational Switches
          </h3>
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
              <div class="space-y-1">
                <p class="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                  Auth0 Dev Bypass
                </p>
                <p class="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">
                  Active
                </p>
              </div>
              <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
            <ToggleCard
              title="Maintenance Guard"
              description="Halt all operational streams."
              :model-value="false"
            />
            <ToggleCard
              title="Public Leaderboard"
              description="Expose performance audits."
              :model-value="true"
            />
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTenantSettings } from '../composables/useTenantSettings'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import DetailSummaryCard from '@/shared/components/cards/DetailSummaryCard.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ModernImageInput from '@/shared/components/forms/ModernImageInput.vue'
import { Check, Copy as CopyIcon, Image as ImageIcon, Printer } from 'lucide-vue-next'

const query = useTenantSettings()
const toast = useToastStore()

const tenantId = ref('tenant_mftl_001')
const orgName = ref('MFTL Foundation')
const supportEmail = ref('support@mftl.com')

const systemLogoProxy = ref('')
const posLogoProxy = ref('')

function copyTenantId() {
  navigator.clipboard.writeText(tenantId.value)
  toast.success('Organization identifier copied')
}

async function saveConfiguration() {
  toast.success('Global configuration synchronized successfully')
}
</script>
