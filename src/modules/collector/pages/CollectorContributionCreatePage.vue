<template>
  <!--
    Breakpoints
    phone  < 768px : full-screen wizard, bottom action bar, large inputs
    tablet 768–1199: card layout with visible step bar
    desktop >= 1200: split view — steps panel left, form right
  -->
  <div class="min-h-screen bg-slate-50 md:bg-transparent">

    <!-- ══════════════════════════════════════════════════
         PHONE HEADER  (< 768 px)
    ══════════════════════════════════════════════════ -->
    <header class="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
      <button
        class="w-10 h-10 flex items-center justify-center border border-slate-200 shrink-0"
        @click="handleBack"
      >
        <ChevronLeft class="w-5 h-5 text-slate-600" />
      </button>
      <div class="flex-1 min-w-0">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Record Collection</p>
        <p class="text-sm font-black text-slate-900 truncate">{{ stepLabels[currentStep - 1] }}</p>
      </div>
      <span class="text-xs font-black text-violet-600 shrink-0">{{ currentStep }}/{{ totalSteps }}</span>
    </header>

    <!-- ══════════════════════════════════════════════════
         TABLET / DESKTOP HEADER  (>= 768 px)
    ══════════════════════════════════════════════════ -->
    <div class="hidden md:block">
      <AdminPageHeader
        title="Record Collection"
        :description="stepLabels[currentStep - 1]"
      >
        <template #actions>
          <AppButton variant="outline" size="sm" @click="handleBack">
            <ChevronLeft class="w-4 h-4 mr-1" />{{ currentStep === 1 ? 'Cancel' : 'Back' }}
          </AppButton>
        </template>
      </AdminPageHeader>
    </div>

    <!-- Progress bar (phone full-width, tablet/desktop contained) -->
    <div class="h-1 bg-slate-200 md:rounded-full md:max-w-md md:mx-0 md:mb-6">
      <div
        class="h-full bg-violet-600 transition-all duration-500"
        :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
      />
    </div>

    <!-- Loading / Error -->
    <div class="px-4 md:px-0">
      <LoadingState v-if="assignmentsQuery.isLoading.value" text="Loading assignments…" />
      <ErrorState
        v-else-if="assignmentsQuery.isError.value"
        title="Could not load assignments"
        :message="assignmentsQuery.error.value?.message ?? 'Check your connection.'"
        show-retry
        @retry="assignmentsQuery.refetch"
      />
    </div>

    <template v-if="!assignmentsQuery.isLoading.value && !assignmentsQuery.isError.value">
      <!-- ══════════════════════════════════════════════════
           DESKTOP: side-by-side layout  (>= 1200 px)
           Left: step navigator + event/fund lists
           Right: current form fields
      ══════════════════════════════════════════════════ -->
      <div class="xl:grid xl:grid-cols-12 xl:gap-8 xl:items-start">

        <!-- Desktop: step progress sidebar -->
        <aside class="hidden xl:block xl:col-span-3">
          <div class="bg-white border border-slate-200 shadow-sm p-5 space-y-1">
            <div
              v-for="(label, i) in stepLabels"
              :key="i"
              class="flex items-center gap-3 px-3 py-2.5 rounded transition-colors"
              :class="i + 1 === currentStep
                ? 'bg-violet-50 text-violet-700'
                : i + 1 < currentStep
                  ? 'text-slate-400'
                  : 'text-slate-400 opacity-50'"
            >
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 border"
                :class="i + 1 < currentStep
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : i + 1 === currentStep
                    ? 'border-violet-600 text-violet-600'
                    : 'border-slate-300 text-slate-400'"
              >
                <Check v-if="i + 1 < currentStep" class="w-3 h-3" />
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="text-xs font-bold uppercase tracking-wide">{{ label }}</span>
            </div>
          </div>
        </aside>

        <!-- Main form area -->
        <div class="xl:col-span-9 px-4 md:px-0 pb-32 md:pb-8 space-y-4 md:space-y-6">

          <!-- ── STEP 1: Event Selection ── -->
          <section v-if="currentStep === 1" class="space-y-3">
            <div class="hidden md:block mb-2">
              <h2 class="text-base font-black text-slate-900 uppercase tracking-tight">Select Event</h2>
              <p class="text-xs text-slate-400 mt-0.5">Which campaign are you collecting for?</p>
            </div>

            <div
              v-if="!assignmentsQuery.data.value?.events.length"
              class="bg-white border border-slate-200 shadow-sm p-8 text-center text-sm text-slate-400"
            >
              No active events. Contact your administrator.
            </div>

            <!-- Phone: large touch-friendly tiles -->
            <button
              v-for="event in assignmentsQuery.data.value?.events"
              :key="event.id"
              class="
                w-full bg-white border border-slate-200
                flex items-center gap-4
                px-4 py-5 md:px-6 md:py-5
                hover:border-violet-400 hover:shadow-md
                active:bg-violet-50
                transition-all text-left group
                min-h-[72px]
              "
              @click="selectEvent(event)"
            >
              <div class="w-10 h-10 md:w-12 md:h-12 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-600 transition-colors shrink-0">
                <Calendar class="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm md:text-base font-black text-slate-900 uppercase truncate">{{ event.title }}</h4>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">{{ event.dateLabel }} · {{ event.location || 'No location' }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 hidden sm:inline">{{ event.assignedFundCount }} fund{{ event.assignedFundCount !== 1 ? 's' : '' }}</span>
                <ArrowRight class="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </section>

          <!-- ── STEP 2: Fund Selection ── -->
          <section v-if="currentStep === 2" class="space-y-3">
            <div class="hidden md:block mb-2">
              <h2 class="text-base font-black text-slate-900 uppercase tracking-tight">Select Fund</h2>
              <p class="text-xs text-slate-400 mt-0.5">Direct contributions to a specific cause</p>
            </div>

            <div
              v-if="!availableFunds.length"
              class="bg-white border border-slate-200 shadow-sm p-8 text-center text-sm text-slate-400"
            >
              No funds assigned to this event. Please select a different event.
            </div>

            <button
              v-for="fund in availableFunds"
              :key="fund.id"
              class="
                w-full bg-white border border-slate-200
                flex items-center gap-4
                px-4 py-5 md:px-6 md:py-5
                hover:border-violet-400 hover:shadow-md
                active:bg-violet-50
                transition-all text-left group
                min-h-[72px]
              "
              @click="selectFund(fund)"
            >
              <div class="w-10 h-10 md:w-12 md:h-12 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-600 transition-colors shrink-0">
                <Target class="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm md:text-base font-black text-slate-900 uppercase truncate">{{ fund.name }}</h4>
                <p class="text-xs text-slate-500 mt-0.5 font-medium truncate">{{ fund.description || 'General collection fund' }}</p>
              </div>
              <ArrowRight class="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          </section>

          <!-- ── STEP 3: Contributor Info ── -->
          <section v-if="currentStep === 3">
            <div class="bg-white border border-slate-200 shadow-sm">
              <div class="px-4 md:px-6 py-4 border-b border-slate-100">
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">Contributor Details</h3>
                <p class="text-xs text-slate-400 mt-0.5">Optional — leave blank for anonymous</p>
              </div>
              <div class="px-4 md:px-6 py-5 space-y-5">
                <div class="grid md:grid-cols-2 gap-5">
                  <AppInput
                    v-model="form.contributorName"
                    label="Full Name"
                    placeholder="e.g. John Doe"
                    :disabled="form.anonymous"
                  />
                  <AppInput
                    v-model="form.contributorPhone"
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g. +233 24 000 0000"
                    :disabled="form.anonymous"
                  />
                  <AppInput
                    v-model="form.contributorEmail"
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="e.g. john@example.com"
                    :disabled="form.anonymous"
                    class="md:col-span-2"
                  />
                </div>

                <!-- Anonymous toggle — large touch target on phone -->
                <div
                  class="flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200 min-h-[56px]"
                  :class="form.anonymous
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300'"
                  @click="form.anonymous = !form.anonymous"
                >
                  <div
                    class="w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors"
                    :class="form.anonymous ? 'border-violet-400 bg-violet-600' : 'border-slate-300'"
                  >
                    <Check v-if="form.anonymous" class="w-3 h-3 text-white" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-black uppercase tracking-tight">Anonymous Donation</p>
                    <p class="text-xs opacity-60 font-medium">Name and contact info will not be stored</p>
                  </div>
                  <component :is="form.anonymous ? UserX : UserCheck" class="w-5 h-5 shrink-0" :class="form.anonymous ? 'text-violet-400' : 'text-slate-300'" />
                </div>

                <!-- Desktop inline Continue button -->
                <AppButton
                  variant="primary"
                  class="w-full hidden md:flex"
                  :disabled="!form.anonymous && (!form.contributorName || !form.contributorPhone)"
                  @click="nextStep"
                >
                  Continue to Amount
                </AppButton>
              </div>
            </div>
          </section>

          <!-- ── STEP 4: Amount & Payment ── -->
          <section v-if="currentStep === 4">
            <div class="bg-white border border-slate-200 shadow-sm">
              <div class="px-4 md:px-6 py-4 border-b border-slate-100">
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight">Amount & Payment</h3>
              </div>
              <div class="px-4 md:px-6 py-6 space-y-8">
                <!-- Amount input — extra large on phone -->
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Amount ({{ form.currency }})</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-violet-600">{{ currencySymbol }}</span>
                    <input
                      ref="amountInputRef"
                      v-model="form.amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="
                        w-full border border-slate-200 bg-slate-50
                        pl-12 pr-4
                        py-5 md:py-4
                        text-3xl md:text-2xl font-black text-slate-900
                        outline-none focus:border-violet-500 focus:bg-white transition-colors
                      "
                    >
                  </div>
                </div>

                <!-- Payment method grid — 3 cols, large tap area on phone -->
                <div>
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Payment Method</label>
                  <div class="grid grid-cols-3 gap-2 md:gap-3">
                    <button
                      v-for="method in paymentMethods"
                      :key="method.id"
                      class="
                        py-4 md:py-4 border-2 flex flex-col md:flex-row items-center justify-center md:gap-2
                        transition-all duration-200 font-bold text-xs uppercase tracking-widest
                        min-h-[72px]
                      "
                      :class="form.paymentMethod === method.id
                        ? 'border-violet-600 bg-violet-600 text-white shadow-lg'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'"
                      @click="form.paymentMethod = method.id"
                    >
                      <component :is="method.icon" class="w-5 h-5 mb-1 md:mb-0" />
                      <span class="text-[10px] md:text-xs">{{ method.label }}</span>
                    </button>
                  </div>
                </div>

                <!-- Desktop inline button -->
                <AppButton
                  variant="primary"
                  class="w-full hidden md:flex"
                  :disabled="!form.amount || Number(form.amount) <= 0"
                  @click="nextStep"
                >
                  Review Collection
                </AppButton>
              </div>
            </div>
          </section>

          <!-- ── STEP 5: Review & PIN ── -->
          <section v-if="currentStep === 5" class="space-y-4">
            <!-- Review card — dark on all breakpoints -->
            <div class="bg-slate-900 text-white px-4 md:px-8 py-6 md:py-8 shadow-xl">
              <div class="flex items-start justify-between border-b border-white/10 pb-5 mb-5">
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                  <h3 class="text-3xl md:text-4xl font-black tracking-tighter">{{ formatCurrency(form.amount, form.currency) }}</h3>
                </div>
                <span class="text-xs font-black text-slate-400 bg-white/10 px-3 py-1.5 uppercase tracking-widest shrink-0">
                  {{ form.paymentMethod }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Event</p>
                  <p class="font-black uppercase truncate text-sm">{{ selectedEvent?.title ?? '—' }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Fund</p>
                  <p class="font-black uppercase truncate text-sm">{{ selectedFund?.name ?? '—' }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Contributor</p>
                  <p class="font-black uppercase truncate text-sm">{{ form.anonymous ? 'Anonymous' : (form.contributorName || '—') }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                  <p class="font-black truncate text-sm">{{ form.anonymous ? '—' : (form.contributorPhone || '—') }}</p>
                </div>
              </div>
            </div>

            <!-- PIN input -->
            <div class="bg-white border border-slate-200 shadow-sm px-4 md:px-6 py-6 space-y-4">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest block text-center">
                Enter Your 4-Digit PIN to Authorize
              </label>
              <div class="relative max-w-[240px] mx-auto">
                <input
                  v-model="form.pin"
                  type="password"
                  maxlength="4"
                  inputmode="numeric"
                  placeholder="••••"
                  class="
                    w-full border-2 py-5 md:py-4
                    text-4xl font-black tracking-[0.5em] text-center
                    outline-none transition-all
                  "
                  :class="pinError
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white'"
                >
                <Lock class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              </div>
              <p v-if="pinError" class="text-center text-sm font-bold text-red-600">{{ pinError }}</p>
              <p v-if="submitError" class="text-center text-sm font-bold text-red-600 bg-red-50 border border-red-200 p-3">{{ submitError }}</p>

              <!-- Desktop inline submit -->
              <AppButton
                variant="primary"
                class="w-full hidden md:flex"
                :disabled="form.pin.length !== 4 || isSubmitting"
                :loading="isSubmitting"
                @click="onSubmit"
              >
                <CheckCircle2 class="w-4 h-4 mr-2" />Confirm & Record
              </AppButton>
            </div>
          </section>

        </div><!-- /main form area -->
      </div><!-- /xl grid -->
    </template>

    <!-- ══════════════════════════════════════════════════
         PHONE: Sticky bottom action bar
         Hidden on md+ (desktop has inline buttons)
    ══════════════════════════════════════════════════ -->
    <div
      v-if="!assignmentsQuery.isLoading.value && !assignmentsQuery.isError.value"
      class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-4 py-3 safe-area-bottom z-30 space-y-2"
    >
      <!-- Step 5: full-width submit -->
      <button
        v-if="currentStep === 5"
        class="
          w-full bg-violet-600 text-white py-4
          text-sm font-black uppercase tracking-widest
          flex items-center justify-center gap-2
          disabled:opacity-40 active:opacity-90 transition-opacity
        "
        :disabled="form.pin.length !== 4 || isSubmitting"
        @click="onSubmit"
      >
        <CheckCircle2 class="w-4 h-4" />
        {{ isSubmitting ? 'Processing…' : 'Confirm & Record' }}
      </button>

      <!-- Steps 3–4: Continue -->
      <button
        v-else-if="currentStep >= 3 && canGoNext"
        class="
          w-full bg-violet-600 text-white py-4
          text-sm font-black uppercase tracking-widest
          flex items-center justify-center gap-2
          disabled:opacity-40 active:opacity-90 transition-opacity
        "
        :disabled="!canGoNext"
        @click="nextStep"
      >
        {{ currentStep === 4 ? 'Review' : 'Continue' }}
      </button>

      <!-- Back row -->
      <button
        class="w-full py-3 text-sm font-bold text-slate-500 uppercase tracking-widest"
        @click="handleBack"
      >
        {{ currentStep === 1 ? 'Cancel' : '← Back' }}
      </button>
    </div>

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
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import {
  ChevronLeft, Calendar, Target, ArrowRight,
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

const stepLabels = ['Select Event', 'Select Fund', 'Contributor Info', 'Amount & Payment', 'Review & Authorize']

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

function selectEvent(event: any) { form.eventId = event.id; nextStep() }

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
  if (currentStep.value > 1) { currentStep.value--; pinError.value = ''; submitError.value = '' }
  else router.back()
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
    }, shouldBypassAuth() ? { headers: { 'X-Dev-User-Id': 'dev-collector' } } : undefined)

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
