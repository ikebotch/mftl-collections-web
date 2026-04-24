<template>
  <div class="space-y-5 pb-4">
    <section class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-semibold text-white">
          New Contribution
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          Capture a contribution with the assigned event and fund locked to this collector.
        </p>
      </div>
      <div class="flex gap-2">
        <AppButton
          variant="ghost"
          size="sm"
          @click="$router.push('/collector/history')"
        >
          History
        </AppButton>
      </div>
    </section>

    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="step in steps"
        :key="step.id"
        class="space-y-2"
      >
        <div class="flex items-center gap-2">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold"
            :class="activeStep >= step.id ? 'border-violet-400 bg-violet-500 text-white' : 'border-white/10 bg-white/[0.04] text-slate-400'"
          >
            {{ step.id }}
          </div>
          <div
            v-if="step.id < 4"
            class="h-[2px] flex-1 rounded-full"
            :class="activeStep > step.id ? 'bg-violet-500' : 'bg-white/10'"
          />
        </div>
        <p class="text-xs text-slate-400">
          {{ step.label }}
        </p>
      </div>
    </div>

    <LoadingState
      v-if="assignmentsQuery.isLoading.value"
      text="Loading collector assignments…"
    />
    <ErrorState
      v-else-if="assignmentsQuery.isError.value"
      title="Could not load assignments"
      :message="assignmentsQuery.error.value?.message ?? 'Try again later.'"
      :correlation-id="assignmentsQuery.error.value?.correlationId"
      show-retry
      @retry="assignmentsQuery.refetch"
    />
    <template v-else-if="assignmentsQuery.data.value">
      <div
        v-if="!assignmentsQuery.data.value.hasAssignments"
        class="rounded-[1.75rem] border border-amber-400/15 bg-amber-400/8 p-5"
      >
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
          Collection blocked
        </p>
        <p class="mt-3 text-sm leading-6 text-slate-200">
          {{ assignmentsQuery.data.value.blockedReason || 'No recipient funds are assigned to this collector.' }}
        </p>
      </div>

      <form
        v-else
        class="space-y-5"
        @submit.prevent="onSubmit"
      >
        <ErrorState
          v-if="submissionError"
          title="Could not record contribution"
          :message="submissionError.message"
          :correlation-id="submissionError.correlationId"
        />

        <section class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4">
          <p class="text-sm font-semibold text-violet-300">
            Selected Event
          </p>
          <div class="mt-4">
            <label class="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Assigned event</label>
            <select
              id="collector-event"
              v-model="form.eventId"
              class="w-full rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-4 text-base text-white outline-none"
            >
              <option value="">
                Select event
              </option>
              <option
                v-for="event in assignmentsQuery.data.value.events"
                :key="event.id"
                :value="event.id"
              >
                {{ event.title }}
              </option>
            </select>
            <p
              v-if="selectedEvent"
              class="mt-3 text-sm text-slate-300"
            >
              {{ selectedEvent.dateLabel }} · {{ selectedEvent.location }} · {{ selectedEvent.status }}
            </p>
            <p
              v-if="errors.eventId"
              class="mt-2 text-xs text-rose-300"
            >
              {{ errors.eventId }}
            </p>
          </div>
        </section>

        <section class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-violet-300">
                Selected Fund
              </p>
              <p class="mt-2 text-sm text-slate-300">
                Funds are filtered to the currently selected event.
              </p>
            </div>
            <router-link
              v-if="form.eventId"
              :to="`/admin/events/${form.eventId}/recipient-funds/new`"
              class="text-xs font-medium text-cyan-300"
            >
              Create fund
            </router-link>
          </div>

          <div class="mt-4">
            <label class="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Assigned fund</label>
            <select
              id="collector-fund"
              v-model="form.recipientFundId"
              :disabled="availableFunds.length === 0"
              class="w-full rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-4 text-base text-white outline-none disabled:opacity-50"
            >
              <option value="">
                {{ fundSelectLabel }}
              </option>
              <option
                v-for="fund in availableFunds"
                :key="fund.id"
                :value="fund.id"
              >
                {{ fund.name }}
              </option>
            </select>
            <p
              v-if="!availableFunds.length && form.eventId"
              class="mt-3 text-sm text-amber-200"
            >
              No recipient funds found for this event.
            </p>
            <p
              v-else-if="selectedFund"
              class="mt-3 text-sm text-slate-300"
            >
              Target {{ formatCurrency(selectedFund.targetAmount, selectedFund.currency) }} · Raised
              {{ formatCurrency(selectedFund.collectedAmount, selectedFund.currency) }}
            </p>
            <p
              v-if="errors.recipientFundId"
              class="mt-2 text-xs text-rose-300"
            >
              {{ errors.recipientFundId }}
            </p>
          </div>
        </section>

        <section class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4">
          <p class="text-sm font-semibold text-violet-300">
            Contributor Details
          </p>
          <div class="mt-4 grid gap-4">
            <div class="rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-3">
              <label
                for="collector-name"
                class="text-xs uppercase tracking-[0.16em] text-slate-400"
              >
                Contributor name
              </label>
              <input
                id="collector-name"
                v-model="form.contributorName"
                :disabled="form.anonymous"
                class="mt-2 w-full bg-transparent text-base text-white outline-none disabled:text-slate-500"
                placeholder="Ama Serwaa"
              >
            </div>
            <p
              v-if="errors.contributorName"
              class="text-xs text-rose-300"
            >
              {{ errors.contributorName }}
            </p>

            <div class="rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-3">
              <label
                for="collector-phone"
                class="text-xs uppercase tracking-[0.16em] text-slate-400"
              >
                Phone number
              </label>
              <input
                id="collector-phone"
                v-model="form.contributorPhone"
                class="mt-2 w-full bg-transparent text-base text-white outline-none"
                placeholder="+233 24 123 4567"
              >
            </div>
            <p
              v-if="errors.contributorPhone"
              class="text-xs text-rose-300"
            >
              {{ errors.contributorPhone }}
            </p>

            <div class="rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-3">
              <label
                for="collector-email"
                class="text-xs uppercase tracking-[0.16em] text-slate-400"
              >
                Email (optional)
              </label>
              <input
                id="collector-email"
                v-model="form.contributorEmail"
                class="mt-2 w-full bg-transparent text-base text-white outline-none"
                placeholder="name@example.com"
              >
            </div>
            <p
              v-if="errors.contributorEmail"
              class="text-xs text-rose-300"
            >
              {{ errors.contributorEmail }}
            </p>

            <label class="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-4">
              <input
                v-model="form.anonymous"
                type="checkbox"
                class="mt-1 h-5 w-5 rounded border-white/20 bg-transparent text-violet-500"
              >
              <span>
                <span class="block text-base font-medium text-white">Anonymous contribution</span>
                <span class="mt-1 block text-sm text-slate-300">
                  Donor name will not appear on receipts or reports.
                </span>
              </span>
            </label>
          </div>
        </section>

        <section class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4">
          <p class="text-sm font-semibold text-violet-300">
            Payment
          </p>
          <div class="mt-4 grid gap-4">
            <div class="grid grid-cols-[2fr_1fr] gap-3">
              <div class="rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-3">
                <label
                  for="collector-amount"
                  class="text-xs uppercase tracking-[0.16em] text-slate-400"
                >
                  Amount
                </label>
                <input
                  id="collector-amount"
                  v-model="form.amount"
                  class="mt-2 w-full bg-transparent text-3xl font-semibold text-white outline-none"
                  inputmode="decimal"
                  placeholder="150.00"
                >
              </div>
              <div class="rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-3">
                <label
                  for="collector-currency"
                  class="text-xs uppercase tracking-[0.16em] text-slate-400"
                >
                  Currency
                </label>
                <select
                  id="collector-currency"
                  v-model="form.currency"
                  class="mt-2 w-full bg-transparent text-xl font-semibold text-white outline-none"
                >
                  <option value="GHS">
                    GHS
                  </option>
                  <option value="USD">
                    USD
                  </option>
                  <option value="GBP">
                    GBP
                  </option>
                </select>
              </div>
            </div>
            <p
              v-if="errors.amount || errors.currency"
              class="text-xs text-rose-300"
            >
              {{ errors.amount || errors.currency }}
            </p>

            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="method in paymentMethods"
                :key="method.value"
                type="button"
                class="rounded-[1.2rem] border px-4 py-4 text-left transition"
                :class="form.paymentMethod === method.value ? method.activeClass : 'border-white/10 bg-[#0F172A] text-slate-200'"
                @click="form.paymentMethod = method.value"
              >
                <p class="text-base font-semibold">
                  {{ method.label }}
                </p>
                <p class="mt-2 text-xs text-slate-300">
                  {{ method.description }}
                </p>
              </button>
            </div>
            <p
              v-if="errors.paymentMethod"
              class="text-xs text-rose-300"
            >
              {{ errors.paymentMethod }}
            </p>
            <p
              v-if="form.paymentMethod !== 'cash'"
              class="text-sm text-amber-200"
            >
              Non-cash collection is backend-pending in this collector flow. Use cash for live local verification.
            </p>

            <div class="rounded-[1.2rem] border border-white/10 bg-[#0F172A] px-4 py-3">
              <label
                for="collector-note"
                class="text-xs uppercase tracking-[0.16em] text-slate-400"
              >
                Note (optional)
              </label>
              <textarea
                id="collector-note"
                v-model="form.note"
                rows="3"
                class="mt-2 w-full resize-none bg-transparent text-base text-white outline-none"
                placeholder="Collection note"
              />
            </div>
          </div>
        </section>

        <div class="sticky bottom-24 z-10 rounded-[1.5rem] border border-white/10 bg-[#0B1220]/95 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur">
          <AppButton
            native-type="submit"
            class="w-full !rounded-[1.25rem] !py-4 text-base"
            size="lg"
            :loading="isSubmitting"
            :disabled="!canSubmit"
          >
            {{ form.paymentMethod === 'cash' ? 'Submit Cash Contribution' : 'Payment initiation pending' }}
          </AppButton>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { useCollectorAssignments } from '../composables/useCollector'
import { collectorContributionSchema } from '../validators/collectorValidators'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { ApiError } from '@/core/api/apiError'
import { shouldBypassAuth } from '@/core/auth/auth0'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/shared/utils/formatters'

const route = useRoute()
const router = useRouter()
const assignmentsQuery = useCollectorAssignments()
const steps = [
  { id: 1, label: 'Event' },
  { id: 2, label: 'Fund' },
  { id: 3, label: 'Details' },
  { id: 4, label: 'Payment' },
]

const form = reactive({
  eventId: typeof route.query.eventId === 'string' ? route.query.eventId : '',
  recipientFundId: '',
  contributorName: '',
  contributorPhone: '',
  contributorEmail: '',
  anonymous: false,
  amount: '',
  currency: 'GHS',
  paymentMethod: 'cash',
  note: '',
})

const errors = ref<Record<string, string>>({})
const submissionError = ref<ApiError | null>(null)
const isSubmitting = ref(false)

const availableFunds = computed(() =>
  (assignmentsQuery.data.value?.funds ?? []).filter(fund => fund.eventId === form.eventId),
)

const selectedEvent = computed(() =>
  (assignmentsQuery.data.value?.events ?? []).find(event => event.id === form.eventId),
)

const selectedFund = computed(() =>
  availableFunds.value.find(fund => fund.id === form.recipientFundId),
)

const fundSelectLabel = computed(() => {
  if (!form.eventId) {
    return 'Select an event first'
  }

  if (!availableFunds.value.length) {
    return 'No recipient funds found for this event'
  }

  return 'Select fund'
})

const activeStep = computed(() => {
  if (!form.eventId) {
    return 1
  }
  if (!form.recipientFundId) {
    return 2
  }
  if (!form.amount || (!form.anonymous && !form.contributorName) || !form.contributorPhone) {
    return 3
  }
  return 4
})

const paymentMethods = [
  { value: 'cash', label: 'Cash', description: 'Record immediate payment', activeClass: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200' },
  { value: 'momo', label: 'Mobile Money', description: 'Initiation pending', activeClass: 'border-amber-400/60 bg-amber-400/10 text-amber-100' },
  { value: 'card', label: 'Card', description: 'Initiation pending', activeClass: 'border-cyan-400/60 bg-cyan-400/10 text-cyan-100' },
  { value: 'bank-transfer', label: 'Bank Transfer', description: 'Placeholder', activeClass: 'border-violet-400/60 bg-violet-400/10 text-violet-100' },
]

const canSubmit = computed(() => {
  if (form.paymentMethod !== 'cash') {
    return false
  }

  return Boolean(
    form.eventId &&
      form.recipientFundId &&
      form.contributorPhone &&
      form.amount &&
      form.currency &&
      (form.anonymous || form.contributorName),
  )
})

watch(
  () => form.eventId,
  () => {
    form.recipientFundId = ''
  },
)

watch(
  () => [assignmentsQuery.data.value, route.query.eventId],
  () => {
    const requestedEventId = typeof route.query.eventId === 'string' ? route.query.eventId : ''
    const matchingEvent = assignmentsQuery.data.value?.events.find(event => event.id === requestedEventId)
    if (matchingEvent) {
      form.eventId = matchingEvent.id
    }
  },
  { immediate: true },
)

async function onSubmit() {
  errors.value = {}
  submissionError.value = null

  const parsed = collectorContributionSchema.safeParse({
    ...form,
    amount: Number(form.amount),
  })

  if (!parsed.success) {
    applyZodErrors(parsed.error)
    return
  }

  if (form.paymentMethod !== 'cash') {
    return
  }

  try {
    isSubmitting.value = true
    const result = await contributionsService.recordCash({
      eventId: form.eventId,
      recipientFundId: form.recipientFundId,
      amount: Number(form.amount),
      currency: form.currency,
      contributorName: form.contributorName,
      contributorPhone: form.contributorPhone,
      contributorEmail: form.contributorEmail || undefined,
      anonymous: form.anonymous,
      paymentMethod: form.paymentMethod,
      note: form.note,
    }, shouldBypassAuth()
      ? {
          headers: {
            'X-Dev-User-Id': 'dev-collector',
          },
        }
      : undefined)

    if (!result.receiptId) {
      throw new Error('Receipt ID was not returned by the backend.')
    }

    await router.push(`/collector/receipts/${result.receiptId}`)
  } catch (error) {
    submissionError.value = error as ApiError
  } finally {
    isSubmitting.value = false
  }
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
