<template>
  <div class="max-w-5xl mx-auto py-12 px-6">
    <header class="mb-12 text-center">
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
        {{ currentStep === 5 ? 'Review collector' : 'Add new collector' }}
      </h1>
      <p class="text-slate-500 mt-3 font-medium text-lg">
        {{ stepDescriptions[currentStep - 1] }}
      </p>
    </header>

    <StepIndicator 
      :steps="['Personal', 'Permissions', 'Assignments', 'Limits', 'Review']"
      :current-step="currentStep"
    />

    <AppCard class="shadow-premium border-none !p-0 overflow-hidden min-h-[500px] flex flex-col">
      <div class="flex-1 p-10">
        <!-- Step 1: Personal Info -->
        <div v-if="currentStep === 1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid md:grid-cols-2 gap-8">
            <AppInput 
              v-model="form.name"
              label="Full Name"
              placeholder="e.g. John Doe"
              required
            />
            <AppInput 
              v-model="form.email"
              label="Email Address"
              placeholder="john@mftl.com"
              required
            />
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <AppInput 
              v-model="form.phone"
              label="Phone Number"
              placeholder="+233..."
              required
            />
            <AppInput 
              v-model="form.staffId"
              label="Staff ID (Optional)"
              placeholder="AGENT-001"
            />
          </div>
        </div>

        <!-- Step 2: Permissions -->
        <div v-if="currentStep === 2" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="space-y-4">
             <label v-for="perm in permissionOptions" :key="perm.id" class="flex items-center gap-4 p-6 rounded-2xl border border-slate-100 bg-white hover:border-violet-200 cursor-pointer transition-all shadow-sm">
                <input type="checkbox" v-model="form.permissions" :value="perm.id" class="w-6 h-6 rounded-lg border-slate-300 text-violet-600 focus:ring-violet-500">
                <div class="flex-1">
                   <p class="text-base font-bold text-slate-900">{{ perm.label }}</p>
                   <p class="text-xs font-medium text-slate-500">{{ perm.description }}</p>
                </div>
             </label>
          </div>
        </div>

        <!-- Step 3: Assignments -->
        <div v-if="currentStep === 3" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6">
                <LayoutGrid class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-bold text-slate-900">Event Assignments</h3>
              <p class="text-slate-500 mt-2 max-w-sm font-medium">
                You can assign this collector to specific events and recipient funds after the account is created.
              </p>
              <div class="mt-8 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                Available after creation
              </div>
           </div>
        </div>

        <!-- Step 4: Performance Limits -->
        <div v-if="currentStep === 4" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid md:grid-cols-2 gap-10">
             <div class="space-y-6">
                <h3 class="text-lg font-bold text-slate-900">Collection Limits</h3>
                <AppInput 
                  v-model="form.dailyLimit"
                  type="number"
                  label="Daily Maximum (GHS)"
                  placeholder="0.00"
                  description="Automatic block if collection exceeds this in a single day."
                />
             </div>
             <div class="space-y-6">
                <h3 class="text-lg font-bold text-slate-900">Security Settings</h3>
                <label class="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white">
                   <input type="checkbox" v-model="form.requireLocation" class="w-5 h-5 rounded text-violet-600">
                   <span class="text-sm font-bold text-slate-900">Require GPS Location for receipts</span>
                </label>
             </div>
          </div>
        </div>

        <!-- Step 5: Review -->
        <div v-if="currentStep === 5" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section class="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
             <div class="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-xl font-black text-slate-900 shadow-soft">
                {{ getInitials(form.name) }}
             </div>
             <div>
                <p class="text-2xl font-bold text-slate-900">{{ form.name }}</p>
                <p class="text-slate-500 font-medium">{{ form.email }} • {{ form.phone }}</p>
             </div>
          </section>

          <div class="grid md:grid-cols-2 gap-8">
             <div>
                <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Permissions</h4>
                <div class="flex flex-wrap gap-2">
                   <span v-for="p in form.permissions" :key="p" class="px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-[10px] font-black uppercase tracking-widest">
                      {{ p }}
                   </span>
                </div>
             </div>
             <div>
                <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Security</h4>
                <p class="text-sm font-bold text-slate-900">Daily Limit: {{ formatCurrency(form.dailyLimit, 'GHS') }}</p>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                   {{ form.requireLocation ? 'GPS Required' : 'GPS Not Required' }}
                </p>
             </div>
          </div>
        </div>
        
        <ErrorState
          v-if="submissionError"
          class="mt-8"
          title="Creation failed"
          :message="submissionError"
        />
      </div>

      <footer class="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <AppButton 
          variant="secondary" 
          @click="prevStep"
          :disabled="currentStep === 1 || isSubmitting"
        >
          Back
        </AppButton>
        <div class="flex items-center gap-3">
          <AppButton 
            v-if="currentStep < 5"
            variant="primary" 
            @click="nextStep"
          >
            Continue
          </AppButton>
          <AppButton 
            v-else
            variant="primary" 
            :loading="isSubmitting"
            @click="submit"
          >
            Create Collector Account
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
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import StepIndicator from '@/shared/components/steppers/StepIndicator.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { LayoutGrid } from 'lucide-vue-next'

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
