<template>
  <div class="space-y-8 pb-20">
    <!-- Page Header -->
    <AdminPageHeader
      title="Record Collection"
      :description="stepLabels[currentStep - 1]"
    >
      <template #actions>
        <AppButton variant="outline" size="sm" @click="handleBack">
          <ChevronLeft class="w-4 h-4 mr-1" />
          {{ currentStep === 1 ? 'Cancel' : 'Back' }}
        </AppButton>
      </template>
    </AdminPageHeader>

    <!-- Step Progress Bar -->
    <div class="bg-white border border-slate-200 shadow-sm p-6">
      <div class="flex items-center gap-2 mb-4">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="flex-1 h-1.5 rounded-full transition-all duration-500"
          :class="step <= currentStep ? 'bg-violet-600' : 'bg-slate-200'"
        />
      </div>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">
        Step {{ currentStep }} of {{ totalSteps }} — {{ stepLabels[currentStep - 1] }}
      </p>
    </div>

    <!-- Loading State for Assignments -->
    <LoadingState v-if="assignmentsQuery.isLoading.value" text="Loading your assignments…" />
    <ErrorState
      v-else-if="assignmentsQuery.isError.value"
      title="Could not load assignments"
      :message="assignmentsQuery.error.value?.message ?? 'Check your connection.'"
      show-retry
      @retry="assignmentsQuery.refetch"
    />

    <template v-else>
      <!-- Step 1: Event Selection -->
      <div v-if="currentStep === 1" class="space-y-4">
        <EmptyState
          v-if="!assignmentsQuery.data.value?.events.length"
          title="No active assignments"
          description="Contact your administrator to be assigned to an event before you can record a collection."
          icon="calendar"
        />
        <div
          v-for="event in assignmentsQuery.data.value?.events"
          :key="event.id"
          class="bg-white border border-slate-200 shadow-sm p-6 flex items-center gap-5 cursor-pointer hover:border-violet-400 hover:shadow-md transition-all group"
          @click="selectEvent(event)"
        >
          <div class="w-12 h-12 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-600 transition-colors shrink-0">
            <Calendar class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-base font-black text-slate-900 uppercase truncate">{{ event.title }}</h4>
            <p class="text-xs text-slate-500 mt-0.5 font-medium">{{ event.dateLabel }} · {{ event.location || 'No location' }}</p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1">{{ event.assignedFundCount }} fund{{ event.assignedFundCount !== 1 ? 's' : '' }}</span>
            <ArrowRight class="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      <!-- Step 2: Fund Selection -->
      <div v-if="currentStep === 2" class="space-y-4">
        <div
          v-for="fund in availableFunds"
          :key="fund.id"
          class="bg-white border border-slate-200 shadow-sm p-6 flex items-center gap-5 cursor-pointer hover:border-violet-400 hover:shadow-md transition-all group"
          @click="selectFund(fund)"
        >
          <div class="w-12 h-12 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-600 transition-colors shrink-0">
            <Target class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-base font-black text-slate-900 uppercase truncate">{{ fund.name }}</h4>
            <p class="text-xs text-slate-500 mt-0.5 font-medium truncate">{{ fund.description || 'General collection fund' }}</p>
          </div>
          <ArrowRight class="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all shrink-0" />
        </div>
        <EmptyState
          v-if="!availableFunds.length"
          title="No funds for this event"
          description="This event has no funds assigned to you. Select a different event."
          icon="wallet"
        />
      </div>

      <!-- Step 3: Contributor Info -->
      <div v-if="currentStep === 3" class="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 class="text-base font-black text-slate-900 uppercase tracking-tight">Contributor Details</h3>

        <div class="grid sm:grid-cols-2 gap-5">
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
            class="sm:col-span-2"
          />
        </div>

        <!-- Anonymous Toggle -->
        <div
          class="flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200 select-none"
          :class="form.anonymous ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300'"
          @click="form.anonymous = !form.anonymous"
        >
          <div
            class="w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors"
            :class="form.anonymous ? 'border-violet-400 bg-violet-600' : 'border-slate-300'"
          >
            <Check v-if="form.anonymous" class="w-3 h-3 text-white" />
          </div>
          <div>
            <p class="text-sm font-black uppercase tracking-tight">Anonymous Donation</p>
            <p class="text-xs opacity-60 font-medium mt-0.5">Name and contact info will not be stored</p>
          </div>
          <component :is="form.anonymous ? UserX : UserCheck" class="w-5 h-5 ml-auto" :class="form.anonymous ? 'text-violet-400' : 'text-slate-300'" />
        </div>

        <AppButton
          variant="primary"
          class="w-full"
          :disabled="!form.anonymous && (!form.contributorName || !form.contributorPhone)"
          @click="nextStep"
        >
          Continue
        </AppButton>
      </div>

      <!-- Step 4: Amount & Payment Method -->
      <div v-if="currentStep === 4" class="bg-white border border-slate-200 shadow-sm p-6 space-y-8">
        <h3 class="text-base font-black text-slate-900 uppercase tracking-tight">Amount & Payment</h3>

        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-widest block">Amount ({{ form.currency }})</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-violet-600">
              {{ currencySymbol }}
            </span>
            <input
              ref="amountInputRef"
              v-model="form.amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="w-full border border-slate-200 bg-slate-50 pl-12 pr-4 py-5 text-3xl font-black text-slate-900 outline-none focus:border-violet-500 focus:bg-white transition-colors"
            >
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-widest block">Payment Method</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="method in paymentMethods"
              :key="method.id"
              class="p-4 border-2 flex flex-col items-center gap-2 transition-all duration-200 font-bold text-xs uppercase tracking-widest"
              :class="form.paymentMethod === method.id
                ? 'border-violet-600 bg-violet-600 text-white shadow-lg'
                : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'"
              @click="form.paymentMethod = method.id"
            >
              <component :is="method.icon" class="w-5 h-5" />
              {{ method.label }}
            </button>
          </div>
        </div>

        <AppButton
          variant="primary"
          class="w-full"
          :disabled="!form.amount || Number(form.amount) <= 0"
          @click="nextStep"
        >
          Review Collection
        </AppButton>
      </div>

      <!-- Step 5: Review & PIN -->
      <div v-if="currentStep === 5" class="space-y-6">
        <!-- Review Card -->
        <div class="bg-slate-900 text-white p-8 shadow-xl">
          <div class="flex items-start justify-between border-b border-white/10 pb-6 mb-6">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Collection Amount</p>
              <h3 class="text-4xl font-black tracking-tighter">{{ formatCurrency(form.amount, form.currency) }}</h3>
            </div>
            <span class="text-xs font-black text-slate-400 bg-white/10 px-3 py-1.5 uppercase tracking-widest">
              {{ form.paymentMethod }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Event</p>
              <p class="font-black uppercase truncate">{{ selectedEvent?.title ?? '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Fund</p>
              <p class="font-black uppercase truncate">{{ selectedFund?.name ?? '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Contributor</p>
              <p class="font-black uppercase truncate">{{ form.anonymous ? 'Anonymous' : (form.contributorName || '—') }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Phone</p>
              <p class="font-black truncate">{{ form.anonymous ? '—' : (form.contributorPhone || '—') }}</p>
            </div>
          </div>
        </div>

        <!-- PIN Input -->
        <div class="bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-widest block text-center">
              Enter Your 4-Digit PIN to Authorize
            </label>
            <div class="relative max-w-[220px] mx-auto">
              <input
                v-model="form.pin"
                type="password"
                maxlength="4"
                inputmode="numeric"
                placeholder="••••"
                class="w-full border-2 p-5 text-4xl font-black tracking-[0.5em] text-center outline-none transition-all"
                :class="pinError
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white'"
              >
              <Lock class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
            <p v-if="pinError" class="text-center text-sm font-bold text-red-600">
              {{ pinError }}
            </p>
          </div>

          <p v-if="submitError" class="text-center text-sm font-bold text-red-600 bg-red-50 border border-red-200 p-3">
            {{ submitError }}
          </p>

          <AppButton
            variant="primary"
            class="w-full"
            :disabled="form.pin.length !== 4 || isSubmitting"
            :loading="isSubmitting"
            @click="onSubmit"
          >
            <CheckCircle2 class="w-4 h-4 mr-2" />
            Confirm & Record
          </AppButton>
        </div>
      </div>
    </template>
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
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
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
  Check,
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
  'Select Event',
  'Select Fund',
  'Contributor Info',
  'Amount & Payment',
  'Review & Authorize',
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
  { id: 'MoMo', label: 'Mobile Money', icon: Smartphone },
  { id: 'Card', label: 'Card / POS', icon: CreditCard },
]

const currencySymbol = computed(() => {
  const symbols: Record<string, string> = { GHS: '₵', USD: '$', GBP: '£', EUR: '€' }
  return symbols[form.currency] ?? form.currency
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

/** Pre-fill event/fund from URL query params (?eventId=...&fundId=...) and skip to step 3 */
onMounted(() => {
  const eventId = route.query.eventId as string | undefined
  const fundId = route.query.fundId as string | undefined

  if (eventId) {
    form.eventId = eventId
    if (fundId) {
      form.recipientFundId = fundId
      // Skip directly to contributor info
      currentStep.value = 3
    } else {
      // Event selected, need to pick fund
      currentStep.value = 2
    }
  }
})

function selectEvent(event: any) {
  form.eventId = event.id
  nextStep()
}

function selectFund(fund: CollectorAssignedFund) {
  form.recipientFundId = fund.id
  form.currency = fund.currency || 'GHS'
  nextStep()
}

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++
    if (currentStep.value === 4) {
      nextTick(() => amountInputRef.value?.focus())
    }
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

  if (form.pin.length !== 4) {
    pinError.value = 'PIN must be 4 digits.'
    return
  }

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
      ? { headers: { 'X-Dev-User-Id': 'dev-collector' } }
      : undefined)

    if (result.receiptId) {
      router.push(`/collector/receipts/${result.receiptId}`)
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message
      ?? error?.response?.data?.errors?.[0]
      ?? error?.message
      ?? 'Submission failed. Please try again.'

    // Distinguish PIN errors from other errors
    if (msg.toLowerCase().includes('pin') || msg.toLowerCase().includes('incorrect') || msg.toLowerCase().includes('unauthorized')) {
      pinError.value = 'Incorrect PIN. Please try again.'
      form.pin = ''
    } else {
      submitError.value = msg
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
