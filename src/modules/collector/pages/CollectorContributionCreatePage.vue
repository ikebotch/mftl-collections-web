<template>
  <div class="min-h-screen bg-[#060B16] text-white selection:bg-violet-500/30">
    <!-- ══════════════════════════════════════════════════
         TERMINAL HEADER
    ══════════════════════════════════════════════════ -->
    <header class="sticky top-0 z-40 bg-[#060B16]/80 backdrop-blur-md border-b border-white/5 px-6 py-5 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          v-if="currentStep > 1"
          class="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
          @click="handleBack"
        >
          <ChevronLeft class="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <p class="text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">Collector Terminal</p>
          <h1 class="text-sm font-black text-white uppercase tracking-tight">{{ stepLabels[currentStep - 1] }}</h1>
        </div>
      </div>
      
      <div class="flex flex-col items-end">
        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ currentStep }} / {{ totalSteps }}</span>
        <div class="flex gap-1 mt-1.5">
          <div 
            v-for="s in totalSteps" 
            :key="s"
            class="h-1 w-4 transition-all duration-300"
            :class="s <= currentStep ? 'bg-violet-500' : 'bg-white/10'"
          />
        </div>
      </div>
    </header>

    <main class="max-w-xl mx-auto px-6 pt-8 pb-32">
      <!-- Loading / Error -->
      <div v-if="assignmentsQuery.isLoading.value" class="py-12">
        <LoadingState text="Initializing assignments…" class="!text-slate-400" />
      </div>
      
      <div v-else-if="assignmentsQuery.isError.value" class="py-12">
        <ErrorState
          title="Terminal Sync Error"
          :message="assignmentsQuery.error.value?.message ?? 'Check network connection.'"
          show-retry
          class="!bg-white/5 !border-white/10"
          @retry="assignmentsQuery.refetch"
        />
      </div>

      <template v-else>
        <!-- ── STEP 1: Event Selection ── -->
        <div v-if="currentStep === 1" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="mb-6">
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Campaigns</h2>
            <p class="text-sm text-slate-400 mt-1">Select an event to begin recording collections.</p>
          </div>

          <div
            v-if="!assignmentsQuery.data.value?.events.length"
            class="bg-white/5 border border-white/10 p-12 text-center"
          >
            <p class="text-sm text-slate-400 leading-relaxed">
              No assigned collections for this hub.<br>
              <span class="text-violet-400 font-bold">Switch hub</span> or contact your administrator if you expected an assignment.
            </p>
          </div>

          <button
            v-for="event in assignmentsQuery.data.value?.events"
            :key="event.id"
            class="
              w-full bg-white/[0.03] border border-white/10 p-6
              hover:border-violet-500/50 hover:bg-white/[0.05]
              active:scale-[0.98] transition-all text-left group relative overflow-hidden
            "
            @click="selectEvent(event)"
          >
            <!-- Decorative accent -->
            <div class="absolute top-0 right-0 p-1">
              <div class="w-1 h-1 bg-violet-500/30" />
            </div>

            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Event</span>
                </div>
                <h4 class="text-xl font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors">
                  {{ event.title }}
                </h4>
                <div class="flex items-center gap-3 mt-4 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3 h-3" />
                    {{ event.dateLabel }}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <MapPin class="w-3 h-3" />
                    {{ event.location || 'Station 01' }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-4">
                <div class="h-12 w-12 bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  <ArrowRight class="w-5 h-5" />
                </div>
                <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">{{ event.assignedFundCount }} FUNDS</span>
              </div>
            </div>
          </button>
        </div>

        <!-- ── STEP 2: Fund Selection ── -->
        <div v-if="currentStep === 2" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Select Fund</h2>
              <p class="text-sm text-slate-400 mt-1">{{ selectedEvent?.title }}</p>
            </div>
            <Target class="w-8 h-8 text-violet-500/20" />
          </div>

          <div
            v-if="!availableFunds.length"
            class="bg-white/5 border border-white/10 p-12 text-center text-sm text-slate-400"
          >
            No funds assigned to this event.
          </div>

          <button
            v-for="fund in availableFunds"
            :key="fund.id"
            class="
              w-full bg-white/[0.03] border border-white/10 p-6
              hover:border-violet-500/50 hover:bg-white/[0.05]
              active:scale-[0.98] transition-all text-left group
            "
            @click="selectFund(fund)"
          >
            <div class="flex items-center gap-5">
              <div class="h-14 w-14 bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-all shrink-0">
                <Banknote v-if="fund.name.toLowerCase().includes('cash')" class="w-6 h-6" />
                <Target v-else class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors">
                  {{ fund.name }}
                </h4>
                <p class="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wide truncate">
                  {{ fund.description || 'General Purpose Fund' }}
                </p>
              </div>
              <ArrowRight class="w-5 h-5 text-slate-700 group-hover:text-violet-500 transition-colors" />
            </div>
          </button>
        </div>

        <!-- ── STEP 3: Contributor Info ── -->
        <div v-if="currentStep === 3" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="mb-6">
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Contributor</h2>
            <p class="text-sm text-slate-400 mt-1">Details for receipt generation</p>
          </div>

          <!-- Anonymous Toggle Card -->
          <button
            class="w-full p-6 border-2 transition-all flex items-center gap-4"
            :class="form.anonymous 
              ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.3)]' 
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'"
            @click="form.anonymous = !form.anonymous"
          >
            <div class="w-6 h-6 border-2 flex items-center justify-center" :class="form.anonymous ? 'border-white' : 'border-slate-600'">
              <Check v-if="form.anonymous" class="w-4 h-4" />
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-black uppercase tracking-widest">Anonymous Donation</p>
              <p class="text-[10px] opacity-60 font-bold uppercase mt-0.5">No contact info required</p>
            </div>
            <UserX v-if="form.anonymous" class="w-6 h-6" />
            <UserCheck v-else class="w-6 h-6 opacity-20" />
          </button>

          <div class="space-y-5" :class="{ 'opacity-20 pointer-events-none transition-opacity': form.anonymous }">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input
                v-model="form.contributorName"
                placeholder="E.G. KWAME MENSAH"
                class="w-full bg-white/5 border border-white/10 p-4 text-white font-bold uppercase tracking-wide focus:border-violet-500 focus:bg-white/10 outline-none transition-all"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                v-model="form.contributorPhone"
                type="tel"
                placeholder="+233 -- --- ----"
                class="w-full bg-white/5 border border-white/10 p-4 text-white font-bold tracking-widest focus:border-violet-500 focus:bg-white/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <!-- ── STEP 4: Amount & Payment ── -->
        <div v-if="currentStep === 4" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="mb-6">
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Contribution Amount</h2>
            <p class="text-sm text-slate-400 mt-1">Specify value in {{ form.currency }}</p>
          </div>

          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <div class="relative bg-[#0F172A] border border-white/10 p-8 flex flex-col items-center">
              <span class="text-xs font-black text-violet-400 uppercase tracking-[0.4em] mb-4">Enter Amount</span>
              <div class="flex items-center gap-3">
                <span class="text-4xl font-black text-slate-600">{{ currencySymbol }}</span>
                <input
                  ref="amountInputRef"
                  v-model="form.amount"
                  type="number"
                  placeholder="0.00"
                  class="bg-transparent text-6xl md:text-7xl font-black text-white outline-none w-full text-center placeholder:text-white/5"
                  @focus="$event.target.select()"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">Payment Method</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                class="
                  flex flex-col items-center gap-3 p-5 border-2 transition-all
                  font-black text-[10px] uppercase tracking-widest
                "
                :class="form.paymentMethod === method.id
                  ? 'border-violet-500 bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                  : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'"
                @click="form.paymentMethod = method.id"
              >
                <component :is="method.icon" class="w-6 h-6" />
                {{ method.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- ── STEP 5: Review & Authorize ── -->
        <div v-if="currentStep === 5" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Digital Receipt Review -->
          <div class="relative">
            <div class="absolute -inset-0.5 bg-white/10 blur-sm"></div>
            <div class="relative bg-white text-slate-900 p-8 shadow-2xl">
              <!-- Serrated edge effect -->
              <div class="absolute -top-1 left-0 right-0 flex justify-between overflow-hidden">
                <div v-for="i in 20" :key="i" class="w-4 h-4 bg-[#060B16] rotate-45 -translate-y-2 shrink-0" />
              </div>

              <div class="text-center border-b-2 border-dashed border-slate-200 pb-6 mb-6">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Contribution Summary</p>
                <h3 class="text-5xl font-black tracking-tighter">{{ formatCurrency(Number(form.amount), form.currency) }}</h3>
                <div class="inline-block mt-4 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                  {{ form.paymentMethod }} PAYMENT
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between items-start gap-4">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign</span>
                  <span class="text-xs font-black uppercase text-right">{{ selectedEvent?.title }}</span>
                </div>
                <div class="flex justify-between items-start gap-4">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fund</span>
                  <span class="text-xs font-black uppercase text-right">{{ selectedFund?.name }}</span>
                </div>
                <div class="flex justify-between items-start gap-4 border-t border-slate-100 pt-4">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contributor</span>
                  <span class="text-xs font-black uppercase text-right">{{ form.anonymous ? 'Anonymous' : form.contributorName }}</span>
                </div>
                <div v-if="!form.anonymous" class="flex justify-between items-start gap-4">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</span>
                  <span class="text-xs font-black text-right">{{ form.contributorPhone }}</span>
                </div>
              </div>

              <div class="mt-8 pt-6 border-t-2 border-dashed border-slate-200 text-center">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Auth Required to Finalize</p>
              </div>
            </div>
          </div>

          <!-- PIN Authorization -->
          <div class="bg-white/5 border border-white/10 p-8 space-y-6">
            <div class="text-center">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-4">
                Collector PIN Authorization
              </label>
              <div class="relative max-w-[280px] mx-auto">
                <input
                  v-model="form.pin"
                  type="password"
                  maxlength="4"
                  inputmode="numeric"
                  placeholder="••••"
                  class="
                    w-full bg-[#0F172A] border-2 py-6
                    text-5xl font-black tracking-[0.6em] text-center text-white
                    outline-none transition-all
                  "
                  :class="pinError
                    ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : 'border-white/10 focus:border-violet-500'"
                />
                <Lock class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
              </div>
              <p v-if="pinError" class="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">{{ pinError }}</p>
              <p v-if="submitError" class="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 uppercase tracking-wide">{{ submitError }}</p>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- ══════════════════════════════════════════════════
         FIXED ACTION BAR
    ══════════════════════════════════════════════════ -->
    <footer class="fixed bottom-0 inset-x-0 bg-[#060B16] border-t border-white/5 p-6 safe-area-bottom z-40">
      <div class="max-w-xl mx-auto">
        <button
          v-if="currentStep < 5"
          class="
            w-full bg-violet-600 text-white py-5
            text-xs font-black uppercase tracking-[0.2em]
            flex items-center justify-center gap-3
            disabled:opacity-20 disabled:grayscale transition-all
            active:scale-[0.98] shadow-[0_10px_30px_rgba(124,58,237,0.3)]
          "
          :disabled="!canGoNext"
          @click="nextStep"
        >
          {{ currentStep === 4 ? 'Review Contribution' : 'Continue' }}
          <ArrowRight class="w-4 h-4" />
        </button>

        <button
          v-else
          class="
            w-full bg-emerald-600 text-white py-5
            text-xs font-black uppercase tracking-[0.2em]
            flex items-center justify-center gap-3
            disabled:opacity-20 transition-all
            active:scale-[0.98] shadow-[0_10px_30px_rgba(16,185,129,0.3)]
          "
          :disabled="form.pin.length !== 4 || isSubmitting"
          @click="onSubmit"
        >
          <template v-if="isSubmitting">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
            Processing...
          </template>
          <template v-else>
            <CheckCircle2 class="w-4 h-4" />
            Authorize & Record
          </template>
        </button>

        <button
          v-if="currentStep === 1"
          class="w-full mt-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors"
          @click="router.back()"
        >
          Cancel Operation
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollectorAssignments } from '../composables/useCollector'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import { shouldBypassAuth } from '@/core/auth/auth0'
import { formatCurrency } from '@/core/formatting/formatters'
import type { CollectorAssignedFund } from '../types/collector'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import {
  ChevronLeft, Calendar, Target, ArrowRight, MapPin,
  Banknote, Smartphone, CreditCard,
  Lock, UserX, UserCheck, CheckCircle2, Check,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const assignmentsQuery = useCollectorAssignments()

const currentStep = ref(1)
const totalSteps = 5
const isSubmitting = ref(false)
const pinError = ref('')
const submitError = ref('')
const amountInputRef = ref<HTMLInputElement | null>(null)

const stepLabels = [
  'Campaign Discovery',
  'Fund Selection',
  'Contributor Details',
  'Amount & Method',
  'Review & Auth'
]

const form = reactive({
  eventId: '',
  recipientFundId: '',
  contributorName: '',
  contributorPhone: '',
  contributorEmail: '',
  anonymous: false,
  amount: '',
  currency: 'GHS',
  paymentMethod: 'Cash',
  note: '',
  pin: '',
})

const paymentMethods = [
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'MoMo', label: 'MoMo', icon: Smartphone },
  { id: 'Card', label: 'Card', icon: CreditCard },
]

const currencySymbol = computed(() => {
  const s: Record<string, string> = { GHS: '₵', USD: '$', GBP: '£', EUR: '€' }
  return s[form.currency] ?? form.currency
})

const availableFunds = computed<CollectorAssignedFund[]>(() =>
  (assignmentsQuery.data.value?.funds ?? []).filter(f => f.eventId === form.eventId),
)

const selectedEvent = computed(() =>
  assignmentsQuery.data.value?.events.find(e => e.id === form.eventId),
)

const selectedFund = computed(() =>
  assignmentsQuery.data.value?.funds.find(f => f.id === form.recipientFundId),
)

const canGoNext = computed(() => {
  if (currentStep.value === 1) return !!form.eventId
  if (currentStep.value === 2) return !!form.recipientFundId
  if (currentStep.value === 3) return form.anonymous || (!!form.contributorName && !!form.contributorPhone)
  if (currentStep.value === 4) return !!form.amount && Number(form.amount) > 0
  return false
})

onMounted(() => {
  const eventId = route.query.eventId as string | undefined
  const fundId = route.query.fundId as string | undefined
  if (eventId) {
    form.eventId = eventId
    if (fundId) { form.recipientFundId = fundId; currentStep.value = 3 }
    else { currentStep.value = 2 }
  }
})

function selectEvent(event: any) { 
  form.eventId = event.id
  // Auto-select fund if there's only one
  const funds = (assignmentsQuery.data.value?.funds ?? []).filter(f => f.eventId === event.id)
  if (funds.length === 1) {
    form.recipientFundId = funds[0].id
    form.currency = funds[0].currency || 'GHS'
    currentStep.value = 3
  } else {
    nextStep()
  }
}

function selectFund(fund: CollectorAssignedFund) {
  form.recipientFundId = fund.id
  form.currency = fund.currency || 'GHS'
  nextStep()
}

function nextStep() {
  if (canGoNext.value && currentStep.value < totalSteps) {
    currentStep.value++
    if (currentStep.value === 4) nextTick(() => amountInputRef.value?.focus())
  }
}

function handleBack() {
  if (currentStep.value > 1) { 
    currentStep.value--
    pinError.value = ''
    submitError.value = '' 
  } else {
    router.back()
  }
}

async function onSubmit() {
  pinError.value = ''
  submitError.value = ''
  if (form.pin.length !== 4) { pinError.value = 'PIN must be 4 digits.'; return }
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
      pin: form.pin,
    }, shouldBypassAuth() ? { headers: { 'X-Dev-User-Id': 'auth0|69f15ff94525b3c84534b6fa' } } : undefined)

    if (result.receiptId) router.push(`/collector/receipts/${result.receiptId}`)
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? error?.response?.data?.errors?.[0] ?? error?.message ?? 'Submission failed.'
    if (/pin|incorrect|unauthorized/i.test(msg)) { pinError.value = 'Incorrect PIN. Please try again.'; form.pin = '' }
    else { submitError.value = msg }
  } finally {
    isSubmitting.value = false
  }
}
</script>
