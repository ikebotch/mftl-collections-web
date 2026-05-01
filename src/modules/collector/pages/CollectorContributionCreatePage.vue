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
        <button
          v-else
          class="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
          @click="router.back()"
        >
          <X class="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <p class="text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">
            Collector Node
          </p>
          <h1 class="text-sm font-black text-white uppercase tracking-tight">
            {{ stepLabels[currentStep - 1] }}
          </h1>
        </div>
      </div>
      
      <div class="flex flex-col items-end">
        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ currentStep }} / {{ totalSteps }}</span>
        <div class="flex gap-1 mt-1.5">
          <div 
            v-for="s in totalSteps" 
            :key="s"
            class="h-1 w-4 transition-all duration-300"
            :class="s <= currentStep ? 'bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'bg-white/10'"
          />
        </div>
      </div>
    </header>

    <main class="max-w-xl mx-auto px-6 pt-8 pb-32">
      <!-- Loading / Error -->
      <div
        v-if="assignmentsQuery.isLoading.value"
        class="py-12"
      >
        <LoadingState
          text="Accessing Assignments…"
          class="!text-slate-400"
        />
      </div>
      
      <div
        v-else-if="assignmentsQuery.isError.value"
        class="py-12"
      >
        <ErrorState
          title="Terminal Access Denied"
          :message="assignmentsQuery.error.value?.message ?? 'Node connection failed.'"
          show-retry
          class="!bg-white/5 !border-white/10"
          @retry="assignmentsQuery.refetch"
        />
      </div>

      <template v-else>
        <!-- ── STEP 1: Event Selection ── -->
        <div
          v-if="currentStep === 1"
          class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="mb-8">
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
              Active Assignments
            </h2>
            <p class="text-sm text-slate-400 mt-1">
              Select a campaign to begin collection.
            </p>
          </div>

          <div
            v-if="!assignmentsQuery.data.value?.events.length"
            class="bg-white/5 border border-white/10 p-16 text-center"
          >
            <CalendarX class="w-12 h-12 text-slate-800 mx-auto mb-6" />
            <h4 class="text-lg font-black text-white uppercase tracking-tight mb-2">
              No Active Hubs
            </h4>
            <p class="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
              No collection hubs have been assigned to your node.<br>
              <span class="text-violet-400 font-bold">Contact supervisor</span> to provision access.
            </p>
          </div>

          <button
            v-for="event in assignmentsQuery.data.value?.events"
            :key="event.id"
            class="
              w-full bg-white/[0.03] border border-white/10 p-8
              hover:border-violet-500/50 hover:bg-white/[0.05]
              active:scale-[0.98] transition-all text-left group relative overflow-hidden
            "
            @click="selectEvent(event)"
          >
            <!-- Decorative accent -->
            <div class="absolute top-0 right-0 p-1.5">
              <div class="w-1.5 h-1.5 bg-violet-500/40" />
            </div>

            <div class="flex items-start justify-between gap-6">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-3">
                  <div class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                  <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LIVE PROTOCOL</span>
                </div>
                <h4 class="text-2xl font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors leading-none">
                  {{ event.title }}
                </h4>
                <div class="flex items-center gap-4 mt-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div class="flex items-center gap-2">
                    <Calendar class="w-3.5 h-3.5 text-violet-500/50" />
                    {{ event.dateLabel }}
                  </div>
                  <div class="flex items-center gap-2">
                    <MapPin class="w-3.5 h-3.5 text-violet-500/50" />
                    {{ event.location || 'HUB 01' }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end justify-between h-full py-1">
                <div class="h-14 w-14 bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-violet-600/20">
                  <ArrowRight class="w-6 h-6" />
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- ── STEP 2: Fund Selection ── -->
        <div
          v-if="currentStep === 2"
          class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                Select Target Fund
              </h2>
              <p class="text-sm font-black text-violet-400 mt-1 uppercase italic tracking-tighter">
                {{ selectedEvent?.title }}
              </p>
            </div>
            <div class="h-12 w-12 bg-white/5 flex items-center justify-center border border-white/5">
              <Target class="w-6 h-6 text-violet-500/30" />
            </div>
          </div>

          <div
            v-if="!availableFunds.length"
            class="bg-white/5 border border-white/10 p-16 text-center"
          >
            <p class="text-sm text-slate-500 uppercase font-black tracking-widest">
              No Authorized Funds Found
            </p>
          </div>

          <button
            v-for="fund in availableFunds"
            :key="fund.id"
            class="
              w-full bg-white/[0.03] border border-white/10 p-8
              hover:border-violet-500/50 hover:bg-white/[0.05]
              active:scale-[0.98] transition-all text-left group flex items-center gap-6 relative
            "
            @click="selectFund(fund)"
          >
            <div class="h-16 w-16 bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-all shrink-0">
              <Banknote
                v-if="fund.name.toLowerCase().includes('cash')"
                class="w-7 h-7"
              />
              <Target
                v-else
                class="w-7 h-7"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-xl font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors leading-tight">
                {{ fund.name }}
              </h4>
              <p class="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest truncate opacity-60">
                {{ fund.description || 'GENERAL HUB ALLOCATION' }}
              </p>
            </div>
            <ArrowRight class="w-5 h-5 text-slate-700 group-hover:text-violet-500 transition-colors" />
          </button>
        </div>

        <!-- ── STEP 3: Contributor Info ── -->
        <div
          v-if="currentStep === 3"
          class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="mb-4">
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
              Contributor Information
            </h2>
            <p class="text-sm text-slate-400 mt-1">
              Audit details for digital receipt generation
            </p>
          </div>

          <!-- Anonymous Toggle Card -->
          <button
            class="w-full p-8 border-2 transition-all flex items-center gap-6 relative overflow-hidden"
            :class="form.anonymous 
              ? 'bg-violet-600 border-violet-500 text-white shadow-[0_20px_50px_rgba(124,58,237,0.25)]' 
              : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'"
            @click="form.anonymous = !form.anonymous"
          >
            <div
              class="w-8 h-8 border-2 flex items-center justify-center shrink-0"
              :class="form.anonymous ? 'border-white' : 'border-slate-700'"
            >
              <Check
                v-if="form.anonymous"
                class="w-5 h-5"
              />
            </div>
            <div class="flex-1 text-left">
              <p class="text-lg font-black uppercase tracking-tight">
                Anonymous Node
              </p>
              <p class="text-[10px] opacity-70 font-black uppercase tracking-widest mt-1">
                Bypass personal data entry
              </p>
            </div>
            <UserX
              v-if="form.anonymous"
              class="w-8 h-8 opacity-40"
            />
            <UserCheck
              v-else
              class="w-8 h-8 opacity-10"
            />
          </button>

          <div
            class="space-y-6"
            :class="{ 'opacity-10 pointer-events-none transition-all duration-500 scale-[0.98]': form.anonymous }"
          >
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Full Identity</label>
              <input
                v-model="form.contributorName"
                placeholder="E.G. KWAME MENSAH"
                class="w-full bg-white/5 border border-white/10 p-6 text-white font-black uppercase tracking-widest focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/5"
              >
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Contact Protocol (Phone)</label>
              <input
                v-model="form.contributorPhone"
                type="tel"
                placeholder="+233 -- --- ----"
                class="w-full bg-white/5 border border-white/10 p-6 text-white font-black tracking-[0.2em] focus:border-violet-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/5"
              >
            </div>
          </div>
        </div>

        <!-- ── STEP 4: Amount & Payment ── -->
        <div
          v-if="currentStep === 4"
          class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="mb-4">
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
              Transaction Value
            </h2>
            <p class="text-sm text-slate-400 mt-1">
              Specify contribution amount in {{ form.currency }}
            </p>
          </div>

          <div class="relative group">
            <div class="absolute -inset-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-20 group-focus-within:opacity-40 transition duration-1000" />
            <div class="relative bg-[#0F172A] border border-white/10 p-12 flex flex-col items-center">
              <div class="flex items-center gap-4">
                <span class="text-5xl font-black text-slate-700 italic tracking-tighter">{{ currencySymbol }}</span>
                <input
                  ref="amountInputRef"
                  v-model="form.amount"
                  type="number"
                  placeholder="0.00"
                  class="bg-transparent text-7xl md:text-8xl font-black text-white outline-none w-full text-center placeholder:text-white/5 tracking-tighter tabular-nums"
                  @focus="$event.target.select()"
                >
              </div>
              <div class="h-1 w-24 bg-violet-600 mt-8 shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
            </div>
          </div>

          <div class="space-y-6">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block text-center">Settlement Method</label>
            <div class="grid grid-cols-3 gap-4">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                class="
                  flex flex-col items-center gap-4 p-6 border-2 transition-all
                  font-black text-[10px] uppercase tracking-[0.2em]
                "
                :class="form.paymentMethod === method.id
                  ? 'border-violet-500 bg-violet-600 text-white shadow-[0_15px_30px_rgba(124,58,237,0.2)]'
                  : 'border-white/5 bg-white/5 text-slate-600 hover:border-white/20'"
                @click="form.paymentMethod = method.id"
              >
                <component
                  :is="method.icon"
                  class="w-7 h-7"
                />
                {{ method.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- ── STEP 5: Review & Authorize ── -->
        <div
          v-if="currentStep === 5"
          class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <!-- Digital Receipt Review -->
          <div class="relative">
            <div class="absolute -inset-1 bg-white/10 blur-md" />
            <div class="relative bg-white text-[#060B16] p-10 shadow-2xl overflow-hidden">
              <!-- Watermark -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-25deg] pointer-events-none whitespace-nowrap">
                <p class="text-9xl font-black uppercase">
                  MFTL NODE
                </p>
              </div>

              <!-- Serrated edge effect -->
              <div class="absolute -top-1 left-0 right-0 flex justify-between overflow-hidden">
                <div
                  v-for="i in 24"
                  :key="i"
                  class="w-4 h-4 bg-[#060B16] rotate-45 -translate-y-2 shrink-0"
                />
              </div>

              <div class="text-center border-b-2 border-dashed border-slate-200 pb-10 mb-10">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">
                  Node Operations
                </p>
                <h3 class="text-6xl font-black tracking-tighter tabular-nums">
                  {{ formatCurrency(Number(form.amount), form.currency) }}
                </h3>
                <div class="inline-block mt-6 px-4 py-1.5 bg-[#060B16] text-white text-[10px] font-black uppercase tracking-[0.3em]">
                  {{ form.paymentMethod }} PROTOCOL
                </div>
              </div>

              <div class="space-y-6">
                <div class="flex justify-between items-start gap-6">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Hub</span>
                  <span class="text-xs font-black uppercase text-right leading-tight">{{ selectedEvent?.title }}</span>
                </div>
                <div class="flex justify-between items-start gap-6">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocation</span>
                  <span class="text-xs font-black uppercase text-right leading-tight">{{ selectedFund?.name }}</span>
                </div>
                <div class="flex justify-between items-start gap-6 border-t border-slate-100 pt-6">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</span>
                  <span class="text-xs font-black uppercase text-right">{{ form.anonymous ? 'Anonymous' : form.contributorName }}</span>
                </div>
                <div
                  v-if="!form.anonymous"
                  class="flex justify-between items-start gap-6"
                >
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</span>
                  <span class="text-xs font-black text-right tracking-widest">{{ form.contributorPhone }}</span>
                </div>
              </div>

              <div class="mt-12 pt-8 border-t-2 border-dashed border-slate-200 text-center">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                  Authorized by node protocol v1.0.4
                </p>
              </div>
            </div>
          </div>

          <!-- PIN Authorization -->
          <div class="bg-white/5 border border-white/10 p-10 space-y-8">
            <div class="text-center">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-6">
                Operational PIN Authorization
              </label>
              <div class="relative max-w-[300px] mx-auto">
                <input
                  v-model="form.pin"
                  type="password"
                  maxlength="4"
                  inputmode="numeric"
                  placeholder="••••"
                  class="
                    w-full bg-[#0F172A] border-2 py-8
                    text-6xl font-black tracking-[0.8em] text-center text-white
                    outline-none transition-all placeholder:text-white/5
                  "
                  :class="pinError
                    ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                    : 'border-white/10 focus:border-violet-500'"
                >
                <Lock class="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700" />
              </div>
              <p
                v-if="pinError"
                class="mt-6 text-xs font-black text-red-500 uppercase tracking-[0.2em] animate-pulse"
              >
                {{ pinError }}
              </p>
              <p
                v-if="submitError"
                class="mt-6 p-6 bg-red-500/10 border border-red-500/20 text-xs font-black text-red-400 uppercase tracking-wide leading-relaxed"
              >
                {{ submitError }}
              </p>
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
