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
          @click="router.back()"
        >
          <ChevronLeft class="w-5 h-5 text-slate-400" />
        </button>
        <div class="h-4 w-px bg-slate-200 mx-2" />
        <h1 class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
          Terminal / New Contribution
        </h1>
      </div>
      
      <div class="flex items-center gap-3 bg-violet-50 border border-violet-100 p-1.5 px-4 rounded-none">
        <div class="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
        <span class="text-[10px] font-black text-violet-700 uppercase tracking-widest">Active Session</span>
      </div>
    </header>

    <!-- Mobile Header -->
    <header
      v-else
      class="sticky top-0 z-30 bg-[#060B16]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between"
    >
      <button 
        class="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform"
        @click="router.back()"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-black tracking-tight uppercase italic">
        Contribution
      </h1>
      <div class="w-10" />
    </header>

    <div class="max-w-5xl mx-auto px-6 py-10 lg:py-16 space-y-12 pb-40">
      <!-- Stepper -->
      <nav class="relative flex justify-between items-start w-full max-w-2xl mx-auto">
        <div
          class="absolute top-5 left-0 right-0 h-[2px] transition-colors duration-500"
          :class="isDesktop ? 'bg-slate-200' : 'bg-white/10'"
        />
        <div 
          class="absolute top-5 left-0 h-[2px] bg-violet-600 transition-all duration-700 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          :style="{ width: `${((activeStep - 1) / 3) * 100}%` }"
        />
        
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="relative z-10 flex flex-col items-center gap-3"
        >
          <div 
            class="w-10 h-10 rounded-none flex items-center justify-center text-[10px] font-black transition-all duration-500 border-2"
            :class="i + 1 <= activeStep 
              ? 'bg-violet-600 border-violet-600 text-white shadow-xl shadow-violet-500/20' 
              : (isDesktop ? 'bg-white border-slate-200 text-slate-300' : 'bg-slate-900 border-white/10 text-slate-600')"
          >
            <Check
              v-if="i + 1 < activeStep"
              class="w-5 h-5"
            />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span
            class="text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500"
            :class="i + 1 <= activeStep ? 'text-violet-600' : 'text-slate-400'"
          >{{ step }}</span>
        </div>
      </nav>

      <LoadingState
        v-if="assignmentsQuery.isLoading.value"
        text="Authorizing collector session..."
        :variant="isDesktop ? 'light' : 'dark'"
      />
      
      <ErrorState
        v-else-if="assignmentsQuery.isError.value"
        title="Session failed"
        :variant="isDesktop ? 'light' : 'dark'"
        :message="assignmentsQuery.error.value?.message ?? 'Connection error.'"
        show-retry
        @retry="assignmentsQuery.refetch"
      />

      <template v-else-if="assignmentsQuery.data.value">
        <div class="grid lg:grid-cols-12 gap-12 items-start">
          <!-- Selection Column -->
          <div class="lg:col-span-7 space-y-10">
            <!-- Event Selection -->
            <div class="space-y-4">
              <div class="flex items-center justify-between px-1">
                <h3
                  class="text-[10px] font-black uppercase tracking-[0.25em]"
                  :class="isDesktop ? 'text-slate-400' : 'text-slate-500'"
                >
                  1. Target Event
                </h3>
                <button 
                  v-if="form.eventId" 
                  class="text-[10px] font-black uppercase tracking-widest text-violet-500 underline underline-offset-4"
                  @click="resetToStep(1)"
                >
                  Reset
                </button>
              </div>

              <div
                v-if="!form.eventId"
                class="grid gap-3"
              >
                <button
                  v-for="event in assignmentsQuery.data.value.events"
                  :key="event.id"
                  class="w-full p-6 text-left border transition-all duration-300 flex items-center gap-6 group"
                  :class="isDesktop ? 'bg-white border-slate-100 hover:border-violet-500/50 hover:shadow-lg' : 'bg-white/5 border-white/5'"
                  @click="selectEvent(event.id)"
                >
                  <div
                    class="w-14 h-14 border flex items-center justify-center transition-colors"
                    :class="isDesktop ? 'bg-slate-50 border-slate-100 text-slate-300 group-hover:text-violet-500' : 'bg-slate-900 border-white/10 text-slate-800'"
                  >
                    <Calendar class="w-7 h-7" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4
                      class="text-lg font-black uppercase italic"
                      :class="isDesktop ? 'text-slate-900' : 'text-white'"
                    >
                      {{ event.title }}
                    </h4>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {{ event.dateLabel }} · {{ event.location }}
                    </p>
                  </div>
                </button>
              </div>

              <div
                v-else
                class="p-6 border flex items-center gap-6"
                :class="isDesktop ? 'bg-white border-violet-500/30 shadow-md shadow-violet-500/5' : 'bg-violet-600/10 border-violet-500/30'"
              >
                <div class="w-14 h-14 bg-violet-600 flex items-center justify-center text-white">
                  <Calendar class="w-7 h-7" />
                </div>
                <div class="min-w-0 flex-1">
                  <h4
                    class="text-lg font-black uppercase italic"
                    :class="isDesktop ? 'text-slate-900' : 'text-white'"
                  >
                    {{ selectedEvent?.title }}
                  </h4>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {{ selectedEvent?.dateLabel }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Fund Selection -->
            <div
              v-if="form.eventId"
              class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div class="flex items-center justify-between px-1">
                <h3
                  class="text-[10px] font-black uppercase tracking-[0.25em]"
                  :class="isDesktop ? 'text-slate-400' : 'text-slate-500'"
                >
                  2. Destination Fund
                </h3>
                <button 
                  v-if="form.recipientFundId" 
                  class="text-[10px] font-black uppercase tracking-widest text-violet-500 underline underline-offset-4"
                  @click="resetToStep(2)"
                >
                  Change
                </button>
              </div>

              <div
                v-if="!form.recipientFundId"
                class="grid gap-3"
              >
                <button
                  v-for="fund in availableFunds"
                  :key="fund.id"
                  class="w-full p-6 text-left border transition-all duration-300 flex items-center gap-6 group"
                  :class="isDesktop ? 'bg-white border-slate-100 hover:border-violet-500/50 hover:shadow-lg' : 'bg-white/5 border-white/5'"
                  @click="form.recipientFundId = fund.id"
                >
                  <div
                    class="w-14 h-14 border flex items-center justify-center transition-colors"
                    :class="isDesktop ? 'bg-slate-50 border-slate-100 text-slate-300 group-hover:text-violet-500' : 'bg-slate-900 border-white/10 text-slate-800'"
                  >
                    <Target class="w-7 h-7" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4
                      class="text-lg font-black uppercase italic"
                      :class="isDesktop ? 'text-slate-900' : 'text-white'"
                    >
                      {{ fund.name }}
                    </h4>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      Target: {{ formatCurrency(fund.targetAmount, 'GHS') }}
                    </p>
                  </div>
                </button>
              </div>

              <div
                v-else
                class="p-6 border flex items-center gap-6"
                :class="isDesktop ? 'bg-white border-violet-500/30 shadow-md shadow-violet-500/5' : 'bg-violet-600/10 border-violet-500/30'"
              >
                <div class="w-14 h-14 bg-violet-600 flex items-center justify-center text-white">
                  <Target class="w-7 h-7" />
                </div>
                <div class="min-w-0 flex-1">
                  <h4
                    class="text-lg font-black uppercase italic"
                    :class="isDesktop ? 'text-slate-900' : 'text-white'"
                  >
                    {{ selectedFund?.name }}
                  </h4>
                  <div class="mt-2 h-1 w-full bg-black/5 rounded-none overflow-hidden">
                    <div
                      class="h-full bg-violet-600"
                      :style="{ width: `${selectedFund?.progress}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Column -->
          <div class="lg:col-span-5">
            <div
              v-if="form.recipientFundId"
              class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700"
            >
              <div
                class="p-8 lg:p-10 border transition-all duration-500 shadow-2xl"
                :class="isDesktop ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'"
              >
                <div class="space-y-8">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Collection Amount</label>
                    <div class="relative group">
                      <span class="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-black text-violet-500 group-focus-within:scale-110 transition-transform duration-500">₵</span>
                      <input 
                        v-model="form.amount"
                        type="number"
                        placeholder="0.00"
                        class="w-full bg-transparent border-b-2 border-slate-200 focus:border-violet-500 py-6 pl-10 text-5xl font-black outline-none transition-all placeholder:text-slate-100"
                        :class="isDesktop ? 'text-slate-900' : 'text-white'"
                      >
                    </div>
                  </div>

                  <div class="space-y-6">
                    <div class="flex items-center justify-between">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Contributor Info</label>
                      <button
                        class="text-[10px] font-black uppercase text-violet-600 hover:underline"
                        @click="form.anonymous = !form.anonymous"
                      >
                        {{ form.anonymous ? 'Clear Anonymous' : 'Set Anonymous' }}
                      </button>
                    </div>

                    <div
                      v-if="!form.anonymous"
                      class="space-y-4"
                    >
                      <input 
                        v-model="form.contributorName"
                        placeholder="Full Name"
                        class="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-black uppercase tracking-tight focus:border-violet-500 outline-none"
                      >
                      <input 
                        v-model="form.contributorPhone"
                        placeholder="Phone Number"
                        class="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-black uppercase tracking-tight focus:border-violet-500 outline-none"
                      >
                    </div>

                    <div
                      v-else
                      class="p-6 bg-slate-900 border-l-4 border-violet-500"
                    >
                      <p class="text-xs font-black text-white uppercase tracking-widest">
                        Anonymous Entry Active
                      </p>
                      <p class="text-[10px] text-slate-500 font-bold uppercase mt-1">
                        Identity will be suppressed on receipt
                      </p>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Collector Authorization PIN</label>
                    <div class="relative group">
                      <input 
                        v-model="form.pin"
                        type="password"
                        maxlength="4"
                        placeholder="••••"
                        class="w-full bg-slate-50 border border-slate-200 p-4 text-2xl font-black tracking-[1em] text-center focus:border-violet-500 outline-none"
                        :class="isDesktop ? 'text-slate-900' : 'text-white'"
                      >
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                        <Lock class="w-5 h-5" />
                      </div>
                    </div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enter your 4-digit security PIN to authorize</p>
                  </div>

                  <div class="pt-6">
                    <AppButton
                      variant="primary"
                      class="w-full !rounded-none !py-6 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-violet-500/30 group"
                      :disabled="!canSubmit || isSubmitting"
                      :loading="isSubmitting"
                      @click="onSubmit"
                    >
                      <span>Finalize Collection</span>
                      <ArrowRight class="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                    </AppButton>
                    <p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
                      Transactions are final once recorded
                    </p>
                  </div>
                </div>
              </div>

              <!-- Desktop only payment summary -->
              <div
                v-if="isDesktop"
                class="p-6 bg-slate-950 text-white flex items-center justify-between border border-slate-900 shadow-xl"
              >
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Banknote class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Payment Type
                    </p>
                    <p class="text-xs font-black uppercase tracking-tight">
                      Hard Currency (Cash)
                    </p>
                  </div>
                </div>
                <Check class="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue'
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
  Check, 
  ChevronLeft,
  Calendar,
  Target,
  ArrowRight,
  Plus,
  Banknote,
  Lock
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const assignmentsQuery = useCollectorAssignments()

const activeStepOverride = ref<number | null>(null)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

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
  pin: '',
})

const submissionError = ref<ApiError | null>(null)
const isSubmitting = ref(false)

const availableFunds = computed(() =>
  (assignmentsQuery.data.value?.funds ?? []).filter(fund => fund.eventId === form.eventId),
)

const steps = ['Event', 'Fund', 'Review']

const activeStep = computed(() => {
  if (activeStepOverride.value) return activeStepOverride.value
  if (!form.eventId) return 1
  if (!form.recipientFundId) return 2
  return 3
})

const selectedEvent = computed(() => 
  assignmentsQuery.data.value?.events.find(e => e.id === form.eventId)
)

const selectedFund = computed(() => 
  assignmentsQuery.data.value?.funds.find(f => f.id === form.recipientFundId)
)

const canSubmit = computed(() => {
  return Boolean(
    form.eventId &&
    form.recipientFundId &&
    form.amount &&
    Number(form.amount) > 0 &&
    form.pin.length === 4 &&
    (form.anonymous || (form.contributorName && form.contributorPhone))
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
      amountValue: Number(form.amount),
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
    submissionError.value = error as ApiError
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.italic {
  font-style: italic;
}
</style>
