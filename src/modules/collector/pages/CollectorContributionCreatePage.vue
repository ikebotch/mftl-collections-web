<template>
  <div class="min-h-screen bg-slate-950 text-white font-sans selection:bg-violet-500/30">
    <!-- Header -->
    <header class="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <button 
        class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform"
        @click="router.back()"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-black tracking-tight">
        New Contribution
      </h1>
      <div class="flex items-center gap-2">
        <button class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
          <Download class="w-5 h-5" />
        </button>
        <button class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
          <MoreHorizontal class="w-5 h-5" />
        </button>
      </div>
    </header>

    <div class="px-6 py-8 space-y-10 pb-40">
      <!-- Stepper -->
      <nav class="relative flex justify-between items-start max-w-sm mx-auto">
        <div class="absolute top-5 left-0 right-0 h-[1px] bg-white/10" />
        <div 
          class="absolute top-5 left-0 h-[1px] bg-violet-500 transition-all duration-700 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          :style="{ width: `${((activeStep - 1) / 3) * 100}%` }"
        />
        
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="relative z-10 flex flex-col items-center gap-3"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 border-2"
            :class="i + 1 <= activeStep ? 'bg-violet-600 border-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]' : 'bg-slate-900 border-white/10 text-slate-500'"
          >
            <Check
              v-if="i + 1 < activeStep"
              class="w-5 h-5"
            />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span
            class="text-[10px] font-black uppercase tracking-widest"
            :class="i + 1 <= activeStep ? 'text-violet-500' : 'text-slate-600'"
          >{{ step }}</span>
        </div>
      </nav>

      <LoadingState
        v-if="assignmentsQuery.isLoading.value"
        text="Authorizing collector session..."
        variant="dark"
      />
      
      <ErrorState
        v-else-if="assignmentsQuery.isError.value"
        title="Session failed"
        variant="dark"
        :message="assignmentsQuery.error.value?.message ?? 'Connection error.'"
        show-retry
        @retry="assignmentsQuery.refetch"
      />

      <template v-else-if="assignmentsQuery.data.value">
        <!-- Event Selection / Summary -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">
              Selected Event
            </h3>
            <button 
              v-if="form.eventId" 
              class="text-[10px] font-black uppercase tracking-widest text-slate-500 underline underline-offset-4 active:text-violet-400"
              @click="resetToStep(1)"
            >
              Change
            </button>
          </div>

          <div
            v-if="!form.eventId"
            class="space-y-3"
          >
            <button
              v-for="event in assignmentsQuery.data.value.events"
              :key="event.id"
              class="w-full p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-4 text-left active:scale-[0.98] transition-all"
              @click="selectEvent(event.id)"
            >
              <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-800">
                <Calendar class="w-8 h-8" />
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-black text-white truncate">
                  {{ event.title }}
                </h4>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {{ event.dateLabel }} · {{ event.location }}
                </p>
              </div>
              <ChevronRight class="w-5 h-5 text-slate-700" />
            </button>
          </div>

          <div
            v-else
            class="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-4"
          >
            <div class="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
              <Calendar class="w-8 h-8 text-slate-800" />
              <div class="absolute inset-0 bg-violet-600/10" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="font-black text-white truncate text-lg">
                {{ selectedEvent?.title }}
              </h4>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {{ selectedEvent?.dateLabel }} · {{ selectedEvent?.location }}
              </p>
            </div>
          </div>
        </div>

        <!-- Fund Selection / Summary -->
        <div
          v-if="form.eventId"
          class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="flex items-center justify-between px-1">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">
              Selected Fund
            </h3>
            <button 
              v-if="form.recipientFundId" 
              class="text-[10px] font-black uppercase tracking-widest text-slate-500 underline underline-offset-4 active:text-cyan-400"
              @click="resetToStep(2)"
            >
              Change
            </button>
          </div>

          <div
            v-if="!form.recipientFundId"
            class="space-y-3"
          >
            <button
              v-for="fund in availableFunds"
              :key="fund.id"
              class="w-full p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-4 text-left active:scale-[0.98] transition-all"
              @click="form.recipientFundId = fund.id"
            >
              <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-800">
                <Target class="w-8 h-8" />
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-black text-white truncate">
                  {{ fund.name }}
                </h4>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Goal: {{ formatCurrency(fund.targetAmount, fund.currency) }}
                </p>
              </div>
              <ChevronRight class="w-5 h-5 text-slate-700" />
            </button>

            <div
              v-if="availableFunds.length === 0"
              class="text-center py-12 px-6 rounded-3xl bg-white/[0.02] border border-dashed border-white/10"
            >
              <p class="text-sm font-bold text-slate-500">
                No recipient funds found for this event.
              </p>
            </div>
          </div>

          <div
            v-else
            class="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-5"
          >
            <div class="flex items-center gap-4">
              <div class="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                <Target class="w-8 h-8 text-slate-800" />
                <div class="absolute inset-0 bg-cyan-600/10" />
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-black text-white truncate text-lg">
                  {{ selectedFund?.name }}
                </h4>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-70 leading-relaxed">
                  {{ selectedFund?.description }}
                </p>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                <span class="text-slate-500">Target: {{ formatCurrency(selectedFund?.targetAmount || 0, 'GHS') }}</span>
                <span class="text-cyan-400">Raised: {{ formatCurrency(selectedFund?.collectedAmount || 0, 'GHS') }} ({{ selectedFund?.progress }}%)</span>
              </div>
              <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-cyan-500 rounded-full transition-all duration-1000"
                  :style="{ width: `${selectedFund?.progress}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div
          v-if="form.recipientFundId"
          class="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          <div class="space-y-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 px-1">
              Contributor Details
            </h3>
            
            <div class="space-y-4">
              <!-- Name -->
              <div 
                class="group p-5 rounded-3xl border border-white/5 bg-white/[0.03] focus-within:border-indigo-500/50 transition-all"
                :class="{ 'opacity-40 pointer-events-none': form.anonymous }"
              >
                <div class="flex items-center gap-4 mb-1">
                  <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-focus-within:text-indigo-500">
                    <User class="w-4 h-4" />
                  </div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name <span class="text-rose-500">*</span></label>
                </div>
                <input 
                  v-model="form.contributorName" 
                  class="w-full bg-transparent pl-12 text-lg font-black text-white outline-none placeholder:text-slate-800"
                  placeholder="Ama Serwaa"
                >
              </div>

              <!-- Phone -->
              <div 
                class="group p-5 rounded-3xl border border-white/5 bg-white/[0.03] focus-within:border-indigo-500/50 transition-all"
                :class="{ 'opacity-40 pointer-events-none': form.anonymous }"
              >
                <div class="flex items-center gap-4 mb-1">
                  <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-focus-within:text-indigo-500">
                    <Phone class="w-4 h-4" />
                  </div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Phone Number <span class="text-rose-500">*</span></label>
                </div>
                <div class="flex items-center gap-3 pl-12">
                  <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold">
                    <span>🇬🇭</span>
                    <ChevronDown class="w-3 h-3 text-slate-500" />
                  </div>
                  <input 
                    v-model="form.contributorPhone" 
                    type="tel"
                    class="w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-800"
                    placeholder="+233 24 123 4567"
                  >
                </div>
              </div>

              <!-- Email -->
              <div 
                class="group p-5 rounded-3xl border border-white/5 bg-white/[0.03] focus-within:border-indigo-500/50 transition-all"
                :class="{ 'opacity-40 pointer-events-none': form.anonymous }"
              >
                <div class="flex items-center gap-4 mb-1">
                  <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-focus-within:text-indigo-500">
                    <Mail class="w-4 h-4" />
                  </div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Email (Optional)</label>
                </div>
                <input 
                  v-model="form.contributorEmail" 
                  type="email"
                  class="w-full bg-transparent pl-12 text-lg font-black text-white outline-none placeholder:text-slate-800"
                  placeholder="amaserwaa@example.com"
                >
              </div>

              <!-- Anonymous Toggle -->
              <label class="flex items-center justify-between p-5 rounded-3xl border border-white/5 bg-white/[0.03] cursor-pointer active:scale-[0.98] transition-transform">
                <div class="flex items-center gap-4">
                  <div 
                    class="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
                    :class="form.anonymous ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-600'"
                  >
                    <EyeOff
                      v-if="form.anonymous"
                      class="w-5 h-5"
                    />
                    <User
                      v-else
                      class="w-5 h-5"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-black text-white">Anonymous contribution</p>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Donor name will not appear on receipts</p>
                  </div>
                </div>
                <div 
                  class="w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center"
                  :class="form.anonymous ? 'bg-indigo-600 border-indigo-600' : 'border-white/10 bg-slate-900'"
                >
                  <Check
                    v-if="form.anonymous"
                    class="w-4 h-4 text-white"
                  />
                </div>
                <input
                  v-model="form.anonymous"
                  type="checkbox"
                  class="hidden"
                >
              </label>
            </div>
          </div>

          <!-- Amount Section -->
          <div class="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 px-1">
              Contribution Amount
            </h3>
            <div class="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 focus-within:border-emerald-500/50 transition-all">
              <div class="flex items-center justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Amount (GHS) <span class="text-rose-500">*</span></label>
                  <input 
                    v-model="form.amount" 
                    type="number"
                    inputmode="decimal"
                    class="w-full bg-transparent text-4xl font-black text-white outline-none placeholder:text-slate-900 tracking-tighter"
                    placeholder="0.00"
                  >
                </div>
                <div class="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <span class="text-sm font-black text-white">{{ form.currency }}</span>
                  <ChevronDown class="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method Section -->
          <div class="space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">
              Payment Method
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="method in paymentMethods" 
                :key="method.value"
                class="relative p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 text-center overflow-hidden active:scale-95"
                :class="form.paymentMethod === method.value ? 'bg-emerald-600/10 border-emerald-500 text-emerald-500' : 'bg-white/[0.03] border-white/5 text-slate-500'"
                @click="form.paymentMethod = method.value"
              >
                <div 
                  class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-lg"
                  :class="form.paymentMethod === method.value ? 'bg-emerald-500 text-white' : 'bg-white/5'"
                >
                  <component
                    :is="method.icon"
                    class="w-6 h-6"
                  />
                </div>
                <span class="text-xs font-black uppercase tracking-widest">{{ method.label }}</span>
                
                <div 
                  class="absolute top-3 right-3 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center"
                  :class="form.paymentMethod === method.value ? 'bg-emerald-500 border-emerald-500' : 'border-white/10'"
                >
                  <Check
                    v-if="form.paymentMethod === method.value"
                    class="w-2.5 h-2.5 text-white"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- Submit Action -->
          <div class="pt-8">
            <AppButton 
              variant="primary" 
              class="w-full !rounded-[2rem] !py-6 text-xl bg-violet-600 hover:bg-violet-500 shadow-[0_20px_50px_rgba(124,58,237,0.3)] group"
              :disabled="!canSubmit || isSubmitting"
              :loading="isSubmitting"
              @click="onSubmit"
            >
              <span>Next: Payment</span>
              <ArrowRight class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </AppButton>
            
            <p
              v-if="submissionError"
              class="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-rose-500 animate-bounce"
            >
              Error: {{ submissionError.message }} (ID: {{ submissionError.correlationId }})
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Bottom Nav Placeholder -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 px-8 py-6 flex items-center justify-between pb-10">
      <div
        v-for="nav in navItems"
        :key="nav.label"
        class="flex flex-col items-center gap-1.5 opacity-40"
      >
        <component
          :is="nav.icon"
          class="w-6 h-6"
        />
        <span class="text-[9px] font-black uppercase tracking-widest">{{ nav.label }}</span>
      </div>
      <div class="absolute -top-10 left-1/2 -translate-x-1/2">
        <div class="w-20 h-20 rounded-full bg-violet-600 border-[8px] border-slate-950 flex items-center justify-center text-white shadow-2xl">
          <Plus class="w-10 h-10" />
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollectorAssignments } from '../composables/useCollector'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { ApiError } from '@/core/api/apiError'
import { shouldBypassAuth } from '@/core/auth/auth0'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  History, 
  Check, 
  ChevronLeft,
  Download,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Target,
  User,
  Phone,
  Mail,
  EyeOff,
  ArrowRight,
  Plus,
  Smartphone,
  Banknote,
  LayoutGrid,
  Calendar
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const assignmentsQuery = useCollectorAssignments()

const activeStepOverride = ref<number | null>(null)

const form = reactive({
  eventId: typeof route.query.eventId === 'string' ? route.query.eventId : '',
  recipientFundId: typeof route.query.fundId === 'string' ? route.query.fundId : '',
  contributorName: '',
  contributorPhone: '',
  contributorEmail: '',
  anonymous: false,
  amount: '',
  currency: 'GHS',
  paymentMethod: 'cash',
  note: '',
})

const submissionError = ref<ApiError | null>(null)
const isSubmitting = ref(false)

const availableFunds = computed(() =>
  (assignmentsQuery.data.value?.funds ?? []).filter(fund => fund.eventId === form.eventId),
)

const steps = ['Event', 'Fund', 'Details', 'Payment']

const activeStep = computed(() => {
  if (activeStepOverride.value) return activeStepOverride.value
  if (!form.eventId) return 1
  if (!form.recipientFundId) return 2
  if (!isStep3Valid.value) return 3
  return 4
})

const selectedEvent = computed(() => 
  assignmentsQuery.data.value?.events.find(e => e.id === form.eventId)
)

const selectedFund = computed(() => 
  assignmentsQuery.data.value?.funds.find(f => f.id === form.recipientFundId)
)

const isStep3Valid = computed(() => {
  if (form.anonymous) return true
  return form.contributorName.length >= 2 && form.contributorPhone.length >= 9
})

const paymentMethods = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'momo', label: 'Mobile Money', icon: Smartphone },
]

const navItems = [
  { label: 'Feed', icon: LayoutGrid },
  { label: 'History', icon: History },
]

const canSubmit = computed(() => {
  return Boolean(
    form.eventId &&
    form.recipientFundId &&
    form.amount &&
    Number(form.amount) > 0 &&
    (form.anonymous || form.contributorName)
  )
})

function resetToStep(step: number) {
  if (step === 1) {
    form.eventId = ''
    form.recipientFundId = ''
  } else if (step === 2) {
    form.recipientFundId = ''
  }
  activeStepOverride.value = step
}

function selectEvent(id: string) {
  form.eventId = id
  form.recipientFundId = ''
  activeStepOverride.value = 2
}


async function onSubmit() {
  submissionError.value = null
  isSubmitting.value = true

  try {
    const result = await contributionsService.recordCash({
      eventId: form.eventId,
      recipientFundId: form.recipientFundId,
      amount: Number(form.amount),
      currency: form.currency,
      contributorName: form.anonymous ? 'Anonymous' : form.contributorName,
      contributorPhone: form.contributorPhone,
      contributorEmail: form.contributorEmail || undefined,
      anonymous: form.anonymous,
      paymentMethod: form.paymentMethod,
      note: form.note,
    }, shouldBypassAuth()
      ? {
          headers: { 'X-Dev-User-Id': 'dev-collector' },
        }
      : undefined)

    if (result.receiptId) {
      router.push(`/collector/receipts/${result.receiptId}`)
    }
  } catch (error) {
    submissionError.value = error as ApiError
  } finally {
    isSubmitting.value = false
  }
}

watch(() => route.query.eventId, (newId) => {
  if (typeof newId === 'string' && newId !== form.eventId) {
    form.eventId = newId
    form.recipientFundId = ''
    activeStepOverride.value = 2
  }
})

watch(() => route.query.fundId, (newId) => {
  if (typeof newId === 'string' && newId !== form.recipientFundId) {
    form.recipientFundId = newId
  }
})

watch(() => form.eventId, (newId) => {
  if (!newId) activeStepOverride.value = 1
})
</script>
