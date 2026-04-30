<template>
  <div class="min-h-screen bg-slate-50/50 pb-32">
    <!-- Centered Header Area -->
    <div class="max-w-[1200px] mx-auto pt-16 pb-12 px-8">
      <header class="mb-16">
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4 uppercase">
          Initialize New Hub
        </h1>
        <p class="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
          Deploy a new regional operational center. Define identity, geographic parameters, and initial operational state.
        </p>
      </header>

      <AdminWizardLayout 
        :sections="steps" 
        title="Deployment Sequence"
      >
        <!-- Step 1: Identity & Narrative -->
        <AppCard 
          id="section-identity"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Phase 01
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Hub Identity
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput 
                v-model="form.name"
                label="Hub Designation (Name)"
                placeholder="e.g. Accra Central Hub"
                required
              />
              <AppInput 
                v-model="form.identifier"
                label="System Identifier"
                placeholder="accra-central-01"
                required
                helper="Unique system slug for this hub"
              />
            </div>
            
            <div class="p-6 border border-slate-200 bg-slate-50 italic text-xs text-slate-500">
              The system identifier will be used in URL paths and internal tracking codes.
            </div>
          </div>
        </AppCard>

        <!-- Step 2: Geographic Parameters -->
        <AppCard 
          id="section-location"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Phase 02
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Operational Domain
            </h2>
          </div>

          <div class="space-y-10">
            <AppInput 
              v-model="form.location"
              label="Physical / Geographic Location"
              placeholder="e.g. Greater Accra, Cantonments"
              required
            />
            
            <div class="pt-4">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">
                Deployment Status
              </label>
              <div class="flex gap-4">
                <button 
                  v-for="status in [{ label: 'Active / Online', value: true }, { label: 'Maintenance / Offline', value: false }]"
                  :key="status.label"
                  type="button"
                  class="flex-1 py-4 px-6 rounded-none border-2 transition-all font-bold text-sm"
                  :class="form.isActive === status.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'"
                  @click="form.isActive = status.value"
                >
                  {{ status.label }}
                </button>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Step 3: Infrastructure Confirmation -->
        <AppCard 
          id="section-confirm"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Phase 03
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Final Validation
            </h2>
          </div>

          <div class="bg-slate-900 p-8 text-white space-y-6">
            <div class="flex justify-between items-center border-b border-white/10 pb-4">
              <span class="text-[10px] font-black uppercase tracking-widest text-white/40">Designation</span>
              <span class="font-bold text-sm">{{ form.name || '---' }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-white/10 pb-4">
              <span class="text-[10px] font-black uppercase tracking-widest text-white/40">Identifier</span>
              <span class="font-mono text-sm text-violet-400 font-black">{{ form.identifier || '---' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black uppercase tracking-widest text-white/40">Domain Status</span>
              <span
                class="text-[10px] font-black uppercase tracking-widest px-2 py-1"
                :class="form.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'"
              >
                {{ form.isActive ? 'Online' : 'Offline' }}
              </span>
            </div>
          </div>
        </AppCard>
      </AdminWizardLayout>
    </div>

    <!-- Sticky Bottom Bar -->
    <StickyFormActions>
      <template #left>
        <div class="flex items-center gap-4">
          <AppButton 
            variant="outline" 
            :disabled="isSubmitting"
            @click="handleCancel"
          >
            Abort Deployment
          </AppButton>
          <div
            v-if="isSubmitting"
            class="flex items-center gap-2"
          >
            <div class="w-2 h-2 rounded-none bg-slate-900 animate-pulse" />
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Initializing Hub...</span>
          </div>
        </div>
      </template>

      <AppButton 
        variant="primary" 
        class="px-12"
        :loading="isSubmitting"
        @click="submit"
      >
        Initialize Hub
      </AppButton>
    </StickyFormActions>

    <!-- Context Validation Warning -->
    <div 
      v-if="isPlatformAdmin && !tenantStore.selectedTenantId"
      class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce"
    >
      <div class="bg-amber-500 text-white px-6 py-3 rounded-none shadow-2xl flex items-center gap-3 border-2 border-white/20 backdrop-blur-md">
        <AlertTriangle class="w-5 h-5" />
        <span class="text-xs font-black uppercase tracking-widest">Select an Organisation context first</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateBranch } from '../composables/useBranches'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import { useTenantStore } from '@/modules/tenants/store/tenantStore'
import { useMe } from '@/modules/users/composables/useUsers'
import { AlertTriangle } from 'lucide-vue-next'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'

const router = useRouter()
const toast = useToastStore()
const tenantStore = useTenantStore()
const { data: me } = useMe()
const createBranchMutation = useCreateBranch()

const isPlatformAdmin = computed(() => me.value?.isPlatformAdmin ?? false)

const steps = [
  { id: 'section-identity', title: 'Identity', subtitle: 'Designation & IDs' },
  { id: 'section-location', title: 'Domain', subtitle: 'Geographics & Status' },
  { id: 'section-confirm', title: 'Validation', subtitle: 'Confirm Deployment' },
]

const isSubmitting = ref(false)

const form = reactive({
  name: '',
  identifier: '',
  location: '',
  isActive: true
})

function handleCancel() {
  router.push('/admin/branches')
}

async function submit() {
  if (isPlatformAdmin.value && !tenantStore.selectedTenantId) {
    toast.error('Strategic Context Missing: Select an organization before initializing hub.')
    return
  }

  if (!form.name || !form.identifier || !form.location) {
    toast.error('Strategic parameters missing. Please complete all fields.')
    return
  }

  isSubmitting.value = true
  
  try {
    const branch = await createBranchMutation.mutateAsync({
      tenantId: tenantStore.selectedTenantId,
      name: form.name,
      identifier: form.identifier,
      location: form.location,
      isActive: form.isActive
    })
    
    toast.success('Hub initialization sequence completed.')
    router.push(`/admin/branches/${branch.id}`)
  } catch (err: any) {
    console.error('Initialization failed:', err)
    toast.error(err.message || 'Failed to initialize hub.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
