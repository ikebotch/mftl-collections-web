<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <!-- Wizard Header -->
    <div class="mb-10 text-center">
      <div class="flex items-center justify-center gap-2 text-violet-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
        <span class="w-8 h-px bg-violet-600/30" />
        Invite Field Team
        <span class="w-8 h-px bg-violet-600/30" />
      </div>
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
        {{ steps[currentStep].title }}
      </h1>
      <p class="text-slate-500 mt-2 font-medium">
        Step {{ currentStep + 1 }} of {{ steps.length }}: {{ steps[currentStep].description }}
      </p>
    </div>

    <!-- Step Progress Indicator -->
    <div class="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="flex flex-col items-center gap-3"
      >
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500"
          :class="[
            index <= currentStep ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-white text-slate-400 border-2 border-slate-100',
            index < currentStep ? 'bg-emerald-500 text-white shadow-emerald-100' : ''
          ]"
        >
          <Check
            v-if="index < currentStep"
            class="w-5 h-5"
          />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span 
          class="text-[10px] font-bold uppercase tracking-widest hidden md:block"
          :class="index <= currentStep ? 'text-slate-900' : 'text-slate-400'"
        >
          {{ step.label }}
        </span>
      </div>
    </div>

    <AppCard class="overflow-hidden border-none shadow-premium !p-0">
      <!-- Step 1: Collector Details -->
      <div
        v-if="currentStep === 0"
        class="p-10 space-y-8"
      >
        <div class="flex flex-col items-center mb-8">
          <div class="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-violet-300 hover:text-violet-500 transition-all cursor-pointer group">
            <Camera class="w-8 h-8 mb-1 group-hover:scale-110 transition-transform" />
            <span class="text-[10px] font-black uppercase">Photo</span>
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <AppInput
            id="coll-name"
            v-model="form.name"
            label="Full Name"
            placeholder="John Doe"
          />
          <AppInput
            id="coll-email"
            v-model="form.email"
            label="Email Address"
            placeholder="john@example.com"
          />
          <AppInput
            id="coll-phone"
            v-model="form.phone"
            label="Phone Number"
            placeholder="+233..."
          />
          <AppSelect
            id="coll-type"
            v-model="form.type"
            label="Collector Type"
            :options="[{ label: 'Field Collector', value: 'collector' }, { label: 'Supervisor', value: 'supervisor' }]"
          />
        </div>
      </div>

      <!-- Step 2: Access & Permissions -->
      <div
        v-if="currentStep === 1"
        class="p-10 space-y-8"
      >
        <SectionHeader
          title="System Access"
          description="Enable specific capabilities for this collector."
        />
        <div class="grid gap-4">
          <div 
            v-for="perm in permissions" 
            :key="perm.id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600">
                <component
                  :is="perm.icon"
                  class="w-5 h-5"
                />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900">
                  {{ perm.label }}
                </p>
                <p class="text-xs text-slate-500 font-medium">
                  {{ perm.description }}
                </p>
              </div>
            </div>
            <div class="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer overflow-hidden">
              <div
                class="absolute inset-y-1 left-1 w-4 h-4 bg-white rounded-full transition-all"
                :class="{ 'translate-x-6 bg-violet-600': perm.enabled }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Assignments -->
      <div
        v-if="currentStep === 2"
        class="p-10 space-y-8"
      >
        <SectionHeader
          title="Event Assignment"
          description="Select which events this agent will collect for."
        />
        <div class="grid gap-4">
          <div 
            v-for="event in ['Community Support 2026', 'Education Fund Drive']" 
            :key="event"
            class="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-violet-200 transition-all cursor-pointer group"
          >
            <div class="w-5 h-5 rounded-md border-2 border-slate-200 group-hover:border-violet-400" />
            <span class="text-sm font-bold text-slate-900">{{ event }}</span>
          </div>
        </div>
        <div class="p-4 bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <AlertCircle class="w-4 h-4" />
          Assignment logic requires backend event link
        </div>
      </div>

      <!-- Step 4: Device & Limits -->
      <div
        v-if="currentStep === 3"
        class="p-10 space-y-8"
      >
        <div class="grid md:grid-cols-2 gap-8">
          <AppInput
            id="coll-limit"
            v-model="form.dailyLimit"
            label="Daily Collection Limit (GHS)"
            type="number"
            placeholder="5000"
          />
          <AppInput
            id="coll-cash-max"
            v-model="form.maxCash"
            label="Max Cash Holding (GHS)"
            type="number"
            placeholder="1000"
          />
        </div>
        <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
          <SectionHeader title="Offline Mode" />
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-600">
              Allow offline contributions if sync fails?
            </p>
            <div class="w-12 h-6 bg-emerald-500 rounded-full relative">
              <div class="absolute inset-y-1 left-7 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5: Review & Invite -->
      <div
        v-if="currentStep === 4"
        class="p-10 space-y-10"
      >
        <div class="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div class="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
            <User class="w-10 h-10" />
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900 font-display">
              {{ form.name || 'Anonymous' }}
            </h3>
            <p class="text-sm font-medium text-slate-500">
              {{ form.email || 'no-email@provided.com' }}
            </p>
            <p class="text-[10px] font-black text-violet-600 uppercase tracking-widest mt-1">
              {{ form.type }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-4">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Permissions
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="p in ['Login', 'Cash', 'Receipts']"
                :key="p"
                class="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-600"
              >{{ p }}</span>
            </div>
          </div>
          <div class="space-y-4">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Security Limits
            </p>
            <p class="text-sm font-bold text-slate-900">
              GHS {{ form.dailyLimit }} / Day
            </p>
          </div>
        </div>

        <div class="p-6 bg-violet-600 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-violet-200">
          <div>
            <p class="font-bold">
              Send Invitation Email
            </p>
            <p class="text-xs text-violet-100 font-medium">
              The collector will receive a link to set their password.
            </p>
          </div>
          <div class="w-12 h-6 bg-white/20 rounded-full relative">
            <div class="absolute inset-y-1 left-7 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="px-10 py-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <AppButton
          variant="secondary"
          class="min-w-[120px]"
          @click="prevStep"
        >
          {{ currentStep === 0 ? 'Cancel' : 'Previous' }}
        </AppButton>
        <AppButton
          variant="primary"
          class="min-w-[160px]"
          @click="nextStep"
        >
          {{ currentStep === steps.length - 1 ? 'Send Invite' : 'Continue' }}
        </AppButton>
      </div>
    </AppCard>

    <div
      v-if="currentStep === steps.length - 1"
      class="mt-8 text-center"
    >
      <p class="text-xs text-slate-400 font-bold uppercase tracking-tighter flex items-center justify-center gap-2">
        <Lock class="w-3 h-3" />
        Collector creation requires backend endpoint - Currently UI Only
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import { 
  Check, 
  User, 
  Camera, 
  Lock, 
  Smartphone, 
  Wallet, 
  FileText, 
  Users,
  AlertCircle
} from 'lucide-vue-next'

const router = useRouter()

const currentStep = ref(0)
const steps = [
  { label: 'Details', title: 'Collector Identity', description: 'Who are we inviting to the team?' },
  { label: 'Access', title: 'Permissions', description: 'What can this agent do?' },
  { label: 'Events', title: 'Assignments', description: 'Which events will they manage?' },
  { label: 'Limits', title: 'Limits & Security', description: 'Set collection boundaries.' },
  { label: 'Review', title: 'Final Invitation', description: 'Ready to send the invite?' },
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  type: 'collector',
  dailyLimit: '5000',
  maxCash: '1000',
})

const permissions = [
  { id: 'login', label: 'Login Access', description: 'Allow logging into the mobile app.', icon: Smartphone, enabled: true },
  { id: 'cash', label: 'Cash Collection', description: 'Agent can record physical cash.', icon: Wallet, enabled: true },
  { id: 'receipts', label: 'Issue Receipts', description: 'Generate and send digital receipts.', icon: FileText, enabled: true },
  { id: 'reports', label: 'Field Reports', description: 'View performance and shift reports.', icon: Users, enabled: false },
]

function prevStep() {
  if (currentStep.value === 0) {
    router.push('/admin/collectors')
  } else {
    currentStep.value--
  }
}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    alert('Collector creation backend pending. Redirecting to list.')
    router.push('/admin/collectors')
  }
}
</script>
