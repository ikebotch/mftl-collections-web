<template>
  <div
    class="min-h-screen font-sans selection:bg-violet-100 selection:text-violet-900 transition-colors duration-500"
    :class="isDesktop ? 'bg-[#f8fafc]' : 'bg-[#060B16] text-white'"
  >
    <!-- Desktop Header -->
    <header
      v-if="isDesktop"
      class="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 px-12 flex items-center justify-between"
    >
      <div class="flex items-center gap-4">
        <button 
          class="h-10 w-10 flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors"
          @click="handleBack"
        >
          <ChevronLeft class="w-5 h-5 text-slate-400" />
        </button>
        <div class="h-4 w-px bg-slate-200 mx-2" />
        <h1 class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
          Terminal / New Collection / Step {{ currentStep }}
        </h1>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3 bg-violet-50 border border-violet-100 p-1.5 px-4 rounded-none">
          <div class="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span class="text-[10px] font-black text-violet-700 uppercase tracking-widest">Live Terminal</span>
        </div>
      </div>
    </header>

    <!-- Mobile Header -->
    <header
      v-else
      class="sticky top-0 z-30 bg-[#060B16]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between"
    >
      <button 
        class="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform"
        @click="handleBack"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-black tracking-tight uppercase italic">
        Collect
      </h1>
      <div class="w-10 flex flex-col items-end">
        <span class="text-[10px] font-black text-violet-400 leading-none">{{ currentStep }}</span>
        <span class="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">of 5</span>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-6 py-8 lg:py-12 space-y-10 pb-40">
      <!-- Stepper Progress -->
      <div class="relative h-1 w-full bg-slate-200 overflow-hidden lg:max-w-md mx-auto">
        <div 
          class="absolute top-0 left-0 h-full bg-violet-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          :style="{ width: `${(currentStep / 5) * 100}%` }"
        />
      </div>

      <main class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Step 1: Event Selection -->
        <section
          v-if="currentStep === 1"
          class="space-y-8"
        >
          <div class="text-center space-y-2">
            <h2
              class="text-2xl lg:text-4xl font-black uppercase italic"
              :class="isDesktop ? 'text-slate-900' : 'text-white'"
            >
              Select Target Event
            </h2>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Which campaign are you collecting for?
            </p>
          </div>

          <div class="grid gap-3">
            <button
              v-for="event in assignmentsQuery.data.value?.events"
              :key="event.id"
              class="w-full p-6 text-left border transition-all duration-300 flex items-center gap-6 group"
              :class="isDesktop ? 'bg-white border-slate-100 hover:border-violet-500/50 hover:shadow-xl' : 'bg-white/5 border-white/5'"
              @click="selectEvent(event)"
            >
              <div
                class="w-14 h-14 border flex items-center justify-center transition-colors shrink-0"
                :class="isDesktop ? 'bg-slate-50 border-slate-100 text-slate-300 group-hover:text-violet-500 group-hover:border-violet-100' : 'bg-slate-900 border-white/10 text-slate-800'"
              >
                <Calendar class="w-7 h-7" />
              </div>
              <div class="min-w-0 flex-1">
                <h4
                  class="text-xl font-black uppercase italic truncate"
                  :class="isDesktop ? 'text-slate-900' : 'text-white'"
                >
                  {{ event.title }}
                </h4>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {{ event.dateLabel }} · {{ event.location }}
                </p>
              </div>
              <ArrowRight class="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-2 transition-all" />
            </button>
          </div>
        </section>

        <!-- Step 2: Fund Selection -->
        <section
          v-if="currentStep === 2"
          class="space-y-8"
        >
          <div class="text-center space-y-2">
            <h2
              class="text-2xl lg:text-4xl font-black uppercase italic"
              :class="isDesktop ? 'text-slate-900' : 'text-white'"
            >
              Select Destination Fund
            </h2>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Direct the funds to a specific cause
            </p>
          </div>

          <div class="grid gap-3">
            <button
              v-for="fund in availableFunds"
              :key="fund.id"
              class="w-full p-6 text-left border transition-all duration-300 flex items-center gap-6 group"
              :class="isDesktop ? 'bg-white border-slate-100 hover:border-violet-500/50 hover:shadow-xl' : 'bg-white/5 border-white/5'"
              @click="selectFund(fund)"
            >
              <div
                class="w-14 h-14 border flex items-center justify-center transition-colors shrink-0"
                :class="isDesktop ? 'bg-slate-50 border-slate-100 text-slate-300 group-hover:text-violet-500' : 'bg-slate-900 border-white/10 text-slate-800'"
              >
                <Target class="w-7 h-7" />
              </div>
              <div class="min-w-0 flex-1">
                <h4
                  class="text-xl font-black uppercase italic truncate"
                  :class="isDesktop ? 'text-slate-900' : 'text-white'"
                >
                  {{ fund.name }}
                </h4>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">
                  {{ fund.description || 'General collection fund' }}
                </p>
              </div>
              <ArrowRight class="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-2 transition-all" />
            </button>
          </div>
        </section>

        <!-- Step 3: Contributor Info -->
        <section
          v-if="currentStep === 3"
          class="space-y-10"
        >
          <div class="text-center space-y-2">
            <h2
              class="text-2xl lg:text-4xl font-black uppercase italic"
              :class="isDesktop ? 'text-slate-900' : 'text-white'"
            >
              Contributor Info
            </h2>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Capture details for internal records
            </p>
          </div>

          <div class="space-y-8">
            <div class="relative">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-3">Full Name</label>
              <input 
                v-model="form.contributorName"
                placeholder="Enter Name"
                class="w-full bg-slate-50 border border-slate-200 p-5 text-xl font-black uppercase tracking-tight focus:border-violet-500 outline-none transition-all"
                :class="isDesktop ? 'text-slate-900' : 'text-slate-900 bg-white'"
              >
            </div>
            <div class="relative">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-3">Phone Number</label>
              <input 
                v-model="form.contributorPhone"
                type="tel"
                placeholder="024 XXX XXXX"
                class="w-full bg-slate-50 border border-slate-200 p-5 text-xl font-black uppercase tracking-tight focus:border-violet-500 outline-none transition-all"
                :class="isDesktop ? 'text-slate-900' : 'text-slate-900 bg-white'"
              >
            </div>

            <!-- Anonymous Toggle Checkbox -->
            <div 
              class="flex items-center gap-4 p-6 border cursor-pointer transition-all duration-300"
              :class="form.anonymous 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : (isDesktop ? 'bg-white border-slate-200 text-slate-400 hover:border-violet-500' : 'bg-white/5 border-white/10')"
              @click="form.anonymous = !form.anonymous"
            >
              <div
                class="relative w-6 h-6 border flex items-center justify-center"
                :class="form.anonymous ? 'border-violet-400' : 'border-slate-300'"
              >
                <Check
                  v-if="form.anonymous"
                  class="w-4 h-4 text-violet-400"
                />
              </div>
              <div class="flex-1">
                <span class="text-[10px] font-black uppercase tracking-widest block">Anonymous Donation</span>
                <p class="text-[8px] font-bold uppercase tracking-tighter opacity-60">
                  Hide name on public/admin platform displays
                </p>
              </div>
              <UserX
                v-if="form.anonymous"
                class="w-5 h-5 text-violet-400"
              />
              <UserCheck
                v-else
                class="w-5 h-5 opacity-20"
              />
            </div>
            
            <AppButton
              variant="primary"
              class="w-full !rounded-none !py-6 text-sm font-black uppercase tracking-widest mt-4"
              :disabled="!form.contributorName || !form.contributorPhone"
              @click="nextStep"
            >
              Continue
            </AppButton>
          </div>
        </section>

        <!-- Step 4: Amount & Payment -->
        <section
          v-if="currentStep === 4"
          class="space-y-10"
        >
          <div class="text-center space-y-2">
            <h2
              class="text-2xl lg:text-4xl font-black uppercase italic"
              :class="isDesktop ? 'text-slate-900' : 'text-white'"
            >
              Amount & Payment
            </h2>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Enter value and select method
            </p>
          </div>

          <div class="space-y-12">
            <!-- Amount Input -->
            <div class="relative group max-w-sm mx-auto text-center">
              <span class="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-black text-violet-500">₵</span>
              <input 
                ref="amountInput"
                v-model="form.amount"
                type="number"
                placeholder="0.00"
                class="w-full bg-transparent border-b-4 border-slate-200 focus:border-violet-500 py-8 pl-10 text-7xl font-black outline-none transition-all text-center"
                :class="isDesktop ? 'text-slate-900' : 'text-white'"
              >
            </div>

            <!-- Payment Methods -->
            <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block text-center">Payment Method</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="p-6 border flex items-center gap-4 transition-all duration-300"
                  :class="form.paymentMethod === method.id 
                    ? 'bg-violet-600 border-violet-600 text-white shadow-lg' 
                    : (isDesktop ? 'bg-white border-slate-200 text-slate-600 hover:border-violet-300' : 'bg-white/5 border-white/10')"
                  @click="form.paymentMethod = method.id"
                >
                  <component
                    :is="method.icon"
                    class="w-6 h-6 shrink-0"
                  />
                  <div class="text-left">
                    <p class="text-[10px] font-black uppercase tracking-widest">
                      {{ method.label }}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <AppButton
              variant="primary"
              class="w-full !rounded-none !py-6 text-sm font-black uppercase tracking-widest"
              :disabled="!form.amount || Number(form.amount) <= 0"
              @click="nextStep"
            >
              Review Transaction
            </AppButton>
          </div>
        </section>

        <!-- Step 5: Review & PIN -->
        <section
          v-if="currentStep === 5"
          class="space-y-10"
        >
          <div class="text-center space-y-2">
            <h2
              class="text-2xl lg:text-4xl font-black uppercase italic"
              :class="isDesktop ? 'text-slate-900' : 'text-white'"
            >
              Final Review
            </h2>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Authorize this collection
            </p>
          </div>

          <div class="bg-slate-900 p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div class="relative z-10 grid gap-6">
              <div class="flex justify-between items-start border-b border-white/10 pb-6">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Contribution Value
                  </p>
                  <h3 class="text-5xl font-black mt-2 tracking-tighter">
                    {{ formatCurrency(form.amount, 'GHS') }}
                  </h3>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Method
                  </p>
                  <p class="text-sm font-black uppercase mt-1">
                    {{ form.paymentMethod }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-8">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Event
                  </p>
                  <p class="text-xs font-black uppercase mt-1 truncate">
                    {{ selectedEvent?.title }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Contributor
                  </p>
                  <p class="text-xs font-black uppercase mt-1 truncate">
                    {{ form.anonymous ? 'Anonymous' : form.contributorName }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Decorative icon -->
            <CheckCircle2 class="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-[0.03]" />
          </div>

          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center block">Collector Authorization PIN</label>
              <div class="relative max-w-[200px] mx-auto">
                <input 
                  v-model="form.pin"
                  type="password"
                  maxlength="4"
                  placeholder="••••"
                  class="w-full bg-slate-50 border border-slate-200 p-5 text-4xl font-black tracking-[0.5em] text-center focus:border-violet-500 outline-none transition-all"
                  :class="isDesktop ? 'text-slate-900' : 'text-slate-900 bg-white'"
                >
                <Lock class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
            </div>

            <AppButton
              variant="primary"
              class="w-full !rounded-none !py-8 text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-violet-500/20"
              :disabled="form.pin.length !== 4 || isSubmitting"
              :loading="isSubmitting"
              @click="onSubmit"
            >
              Commit Collection
            </AppButton>
            
            <p class="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              Encrypted · Secure Transaction · Terminal {{ terminalId }}
            </p>
          </div>
        </section>
      </main>
    </div>

    <!-- Mobile Navigation Bottom Bar (Back/Next) -->
    <footer 
      v-if="!isDesktop && currentStep < 5" 
      class="fixed inset-x-0 bottom-0 p-6 bg-[#060B16]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between gap-4 z-50"
    >
      <button 
        class="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border border-white/10 active:scale-95 transition-all"
        @click="currentStep > 1 ? currentStep-- : router.back()"
      >
        {{ currentStep === 1 ? 'Cancel' : 'Back' }}
      </button>
      <button 
        v-if="canGoNext"
        class="flex-[2] py-4 bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-violet-600/20"
        @click="nextStep"
      >
        {{ currentStep === 4 ? 'Review' : 'Continue' }}
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorAssignments } from '../composables/useCollector'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import { shouldBypassAuth } from '@/core/auth/auth0'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { formatCurrency } from '@/core/formatting/formatters'
import { 
  ChevronLeft,
  Calendar,
  Target,
  ArrowRight,
  Banknote,
  Smartphone,
  CreditCard,
  Lock,
  UserX,
  UserCheck,
  CheckCircle2,
  Check
} from 'lucide-vue-next'

const router = useRouter()
const assignmentsQuery = useCollectorAssignments()
const currentStep = ref(1)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const terminalId = ref('ACC-01-A')
const isSubmitting = ref(false)

const isDesktop = computed(() => windowWidth.value >= 1024)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const form = reactive({
  eventId: '',
  recipientFundId: '',
  contributorName: '',
  contributorPhone: '',
  contributorEmail: '',
  anonymous: false,
  amount: '',
  currency: 'GHS',
  paymentMethod: 'cash',
  note: '',
  pin: '',
})

const paymentMethods = [
  { id: 'cash', label: 'Hard Cash', icon: Banknote },
  { id: 'momo', label: 'Mobile Money', icon: Smartphone },
  { id: 'pos', label: 'Card / POS', icon: CreditCard }
]

const availableFunds = computed(() =>
  (assignmentsQuery.data.value?.funds ?? []).filter(fund => fund.eventId === form.eventId),
)

const selectedEvent = computed(() => 
  assignmentsQuery.data.value?.events.find(e => e.id === form.eventId)
)

const selectedFund = computed(() => 
  assignmentsQuery.data.value?.funds.find(f => f.id === form.recipientFundId)
)

const canGoNext = computed(() => {
  if (currentStep.value === 1) return !!form.eventId
  if (currentStep.value === 2) return !!form.recipientFundId
  if (currentStep.value === 3) return form.anonymous || (form.contributorName && form.contributorPhone)
  if (currentStep.value === 4) return form.amount && Number(form.amount) > 0
  return false
})

function nextStep() {
  if (canGoNext.value) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleBack() {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.back()
  }
}

function selectEvent(event: any) {
  form.eventId = event.id
  nextStep()
}

function selectFund(fund: any) {
  form.recipientFundId = fund.id
  nextStep()
}

async function onSubmit() {
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
    }, shouldBypassAuth()
      ? {
          headers: { 'X-Dev-User-Id': 'dev-collector' },
        }
      : undefined)

    if (result.receiptId) {
      router.push(`/collector/receipts/${result.receiptId}`)
    }
  } catch (error) {
    console.error('Submission failed', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.italic {
  font-style: italic;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
