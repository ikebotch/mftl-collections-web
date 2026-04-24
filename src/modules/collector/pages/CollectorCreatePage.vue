<template>
  <div class="max-w-6xl mx-auto py-20 px-8">
    <!-- Editorial Header -->
    <header class="mb-20 text-center space-y-4">
      <div class="flex items-center justify-center gap-3 mb-2">
        <div class="w-1.5 h-8 bg-slate-900" />
        <h1 class="text-6xl font-black font-display tracking-tighter text-slate-900 uppercase italic">
          {{ currentStep === 5 ? 'Review Profile' : 'New Collector' }}
        </h1>
      </div>
      <p class="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">
        {{ stepDescriptions[currentStep - 1] }}
      </p>
    </header>

    <!-- High-Fidelity Stepper -->
    <div class="mb-16">
      <StepIndicator 
        :steps="['Identity', 'Scope', 'Logic', 'Security', 'Review']"
        :current-step="currentStep"
        class="max-w-3xl mx-auto"
      />
    </div>

    <AppCard class="!rounded-[3rem] border-2 border-slate-100 shadow-2xl !p-0 overflow-hidden min-h-[600px] flex flex-col bg-white">
      <div class="flex-1 p-12 md:p-16">
        <!-- Step 1: Personal Info -->
        <div
          v-if="currentStep === 1"
          class="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput 
              v-model="form.name"
              label="Full Legal Name"
              placeholder="e.g. John Doe"
              class="!py-7 !rounded-2xl !bg-slate-50 border-none focus:ring-2 focus:ring-violet-500/20"
              required
            />
            <AppInput 
              v-model="form.email"
              label="Professional Email"
              placeholder="john@mftl.com"
              class="!py-7 !rounded-2xl !bg-slate-50 border-none focus:ring-2 focus:ring-violet-500/20"
              required
            />
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <AppInput 
              v-model="form.phone"
              label="Field Phone Number"
              placeholder="+233..."
              class="!py-7 !rounded-2xl !bg-slate-50 border-none focus:ring-2 focus:ring-violet-500/20"
              required
            />
            <AppInput 
              v-model="form.staffId"
              label="Internal Staff ID"
              placeholder="AGENT-001"
              class="!py-7 !rounded-2xl !bg-slate-50 border-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        <!-- Step 2: Permissions -->
        <div
          v-if="currentStep === 2"
          class="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div class="grid gap-4">
            <label
              v-for="perm in permissionOptions"
              :key="perm.id"
              class="flex items-center gap-6 p-8 rounded-[2.5rem] border-2 border-slate-50 bg-slate-50/30 hover:border-violet-200 hover:bg-violet-50/30 cursor-pointer transition-all group"
            >
              <div class="relative flex items-center justify-center">
                <input
                  v-model="form.permissions"
                  type="checkbox"
                  :value="perm.id"
                  class="peer w-8 h-8 rounded-xl border-2 border-slate-200 text-violet-600 focus:ring-violet-500/20 transition-all cursor-pointer"
                >
                <div class="absolute inset-0 bg-violet-600 rounded-xl opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                  <Check class="w-5 h-5 text-white" />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-base font-black text-slate-900 uppercase tracking-tight italic">{{ perm.label }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ perm.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 3: Assignments -->
        <div
          v-if="currentStep === 3"
          class="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-24 h-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white mb-8 shadow-2xl relative">
              <div class="absolute inset-0 bg-violet-600 rounded-[2.5rem] animate-pulse opacity-20" />
              <LayoutGrid class="w-10 h-10 relative z-10" />
            </div>
            <h3 class="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Operational Scope
            </h3>
            <p class="text-slate-500 mt-4 max-w-sm font-bold uppercase tracking-widest text-[10px] leading-relaxed">
              Assignments to specific campaigns and funds will be configured in the Post-Provisioning stage.
            </p>
            <div class="mt-10 px-6 py-2 rounded-xl bg-violet-600 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-violet-600/20">
              Deferred Assignment Strategy
            </div>
          </div>
        </div>

        <!-- Step 4: Logic & Security -->
        <div
          v-if="currentStep === 4"
          class="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div class="grid md:grid-cols-2 gap-16">
            <div class="space-y-8">
              <h3 class="text-lg font-black text-slate-900 uppercase italic tracking-tight">
                Collection Logic
              </h3>
              <AppInput 
                v-model="form.dailyLimit"
                type="number"
                label="Daily Hard Limit (GHS)"
                placeholder="0.00"
                class="!py-7 !rounded-2xl !bg-slate-50 border-none focus:ring-2 focus:ring-violet-500/20"
                description="Terminal will automatically lock if threshold is breached."
              />
            </div>
            <div class="space-y-8">
              <h3 class="text-lg font-black text-slate-900 uppercase italic tracking-tight">
                Security Constraints
              </h3>
              <label class="flex items-center gap-5 p-8 rounded-[2.5rem] border-2 border-slate-50 bg-slate-50/30 hover:border-emerald-200 cursor-pointer transition-all group">
                <div class="relative flex items-center justify-center">
                  <input
                    v-model="form.requireLocation"
                    type="checkbox"
                    class="peer w-8 h-8 rounded-xl border-2 border-slate-200 text-emerald-600 focus:ring-emerald-500/20 transition-all cursor-pointer"
                  >
                  <div class="absolute inset-0 bg-emerald-600 rounded-xl opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                    <Check class="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <span class="text-sm font-black text-slate-900 uppercase tracking-tight italic">Mandatory GPS Telemetry</span>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit trail requires location headers</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 5: Review -->
        <div
          v-if="currentStep === 5"
          class="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <section class="flex items-center gap-8 p-10 rounded-[3rem] bg-slate-900 overflow-hidden relative shadow-2xl">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.5),transparent)]" />
            <div class="relative z-10 w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
              {{ getInitials(form.name) }}
            </div>
            <div class="relative z-10">
              <p class="text-3xl font-black text-white tracking-tighter uppercase italic">
                {{ form.name }}
              </p>
              <p class="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
                {{ form.email }} • {{ form.phone }}
              </p>
            </div>
          </section>

          <div class="grid md:grid-cols-2 gap-12 px-4">
            <div>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Shield class="w-3 h-3" />
                Authorization Scope
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="p in form.permissions"
                  :key="p"
                  class="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-[9px] font-black uppercase tracking-widest border border-violet-100"
                >
                  {{ p.replace('_', ' ') }}
                </span>
              </div>
            </div>
            <div>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Zap class="w-3 h-3" />
                Operational Logic
              </h4>
              <div class="space-y-2">
                <p class="text-base font-black text-slate-900 italic tracking-tight">
                  Threshold: {{ formatCurrency(form.dailyLimit, 'GHS') }}
                </p>
                <div class="flex items-center gap-2">
                  <div :class="[form.requireLocation ? 'bg-emerald-500' : 'bg-slate-300', 'w-1.5 h-1.5 rounded-full']" />
                  <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {{ form.requireLocation ? 'Telemetry Active' : 'Telemetry Disabled' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ErrorState
          v-if="submissionError"
          class="mt-12"
          title="Provisioning Failed"
          :message="submissionError"
        />
      </div>

      <footer class="p-10 md:p-12 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <AppButton 
          variant="outline" 
          class="!rounded-2xl !py-6 !px-10 border-2 border-slate-200 hover:border-slate-900 font-black uppercase tracking-widest text-[10px]"
          :disabled="currentStep === 1 || isSubmitting"
          @click="prevStep"
        >
          Back
        </AppButton>
        <div class="flex items-center gap-4">
          <AppButton 
            v-if="currentStep < 5"
            variant="primary" 
            class="!rounded-2xl !py-6 !px-12 bg-slate-900 font-black uppercase tracking-widest text-[10px] shadow-xl"
            @click="nextStep"
          >
            Continue
          </AppButton>
          <AppButton 
            v-else
            variant="primary" 
            class="!rounded-2xl !py-6 !px-12 bg-violet-600 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-violet-600/30"
            :loading="isSubmitting"
            @click="submit"
          >
            Provision Collector
          </AppButton>
        </div>
      </footer>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { collectorService } from '../services/collectorService'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import StepIndicator from '@/shared/components/steppers/StepIndicator.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { LayoutGrid, Check, Shield, Zap } from 'lucide-vue-next'

const router = useRouter()
const currentStep = ref(1)
const isSubmitting = ref(false)
const submissionError = ref<string | null>(null)

const stepDescriptions = [
  'Provide the basic identity details for the collection agent.',
  'Define what actions this collector can perform in the field.',
  'Assign the collector to specific events and funds.',
  'Set financial limits and security requirements.',
  'Review the profile before final creation.'
]

const permissionOptions = [
  { id: 'collect_cash', label: 'Cash Collection', description: 'Can record and issue receipts for physical cash' },
  { id: 'issue_refunds', label: 'Issue Refunds', description: 'Can initiate refund requests for contributions' },
  { id: 'view_history', label: 'View History', description: 'Can see past receipts they have issued' },
  { id: 'manage_events', label: 'Event Manager', description: 'Advanced permissions for on-site management' }
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  staffId: '',
  permissions: ['collect_cash', 'view_history'],
  dailyLimit: 5000,
  requireLocation: true
})

function nextStep() {
  if (currentStep.value < 5) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

async function submit() {
  isSubmitting.value = true
  submissionError.value = null
  
  try {
    await collectorService.create({
      name: form.name,
      email: form.email,
      phoneNumber: form.phone,
      // staffId etc are for metadata
    })
    
    router.push('/admin/collectors')
  } catch (err: any) {
    submissionError.value = err.message || 'Failed to create collector. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function getInitials(name?: string) {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>
