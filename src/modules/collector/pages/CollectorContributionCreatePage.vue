<template>
  <div class="space-y-6">
    <section class="space-y-3">
      <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
        Collector
      </p>
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div class="space-y-2">
          <h2 class="text-3xl font-semibold tracking-tight text-white">
            New cash contribution
          </h2>
          <p class="max-w-2xl text-sm leading-6 text-slate-300">
            Capture in-person collections quickly, validate required details, and issue a receipt immediately.
          </p>
        </div>
        <div class="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
          Select an event first, then choose a recipient fund to unlock submission.
        </div>
      </div>
    </section>

    <AppCard class="border-white/10 bg-white/95 shadow-2xl shadow-slate-950/30">
      <ErrorState
        v-if="submissionError"
        title="Could not record contribution"
        :message="submissionError.message"
        :correlation-id="submissionError.correlationId"
      />
      <ErrorState
        v-else-if="eventsQuery.isError.value"
        title="Could not load assigned events"
        :message="eventsQuery.error.value?.message ?? 'Try again later.'"
        :correlation-id="eventsQuery.error.value?.correlationId"
        show-retry
        @retry="eventsQuery.refetch"
      />
      <form
        v-else
        class="grid gap-5 md:grid-cols-2"
        @submit.prevent="onSubmit"
      >
        <div class="space-y-3">
          <AppSelect
            id="collector-event"
            v-model="form.eventId"
            label="Assigned event"
            :options="eventOptions"
            :disabled="eventsQuery.isLoading.value"
            :error="errors.eventId"
          />
          <div
            v-if="eventsQuery.isLoading.value"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
          >
            Loading available events…
          </div>
          <div
            v-else-if="(eventsQuery.data.value?.length ?? 0) === 0"
            class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            <p class="font-semibold">
              No assigned events yet
            </p>
            <router-link
              to="/admin/events/new"
              class="mt-2 inline-flex font-semibold text-violet-700 underline underline-offset-4"
            >
              Create an event in admin
            </router-link>
          </div>
        </div>

        <div class="space-y-3">
          <AppSelect
            id="collector-fund"
            v-model="form.recipientFundId"
            label="Recipient fund"
            :options="fundOptions"
            :disabled="fundSelectDisabled"
            :error="errors.recipientFundId"
          />
          <div
            v-if="fundHelper.message"
            class="rounded-2xl border px-4 py-3 text-sm"
            :class="fundHelper.classes"
          >
            <p class="font-semibold">
              {{ fundHelper.title }}
            </p>
            <p class="mt-1 leading-6">
              {{ fundHelper.message }}
            </p>
            <router-link
              v-if="fundHelper.showCreateLink"
              :to="fundCreationPath"
              class="mt-3 inline-flex font-semibold text-violet-700 underline underline-offset-4"
            >
              Create recipient fund in admin
            </router-link>
          </div>
        </div>

        <AppInput
          id="collector-name"
          v-model="form.contributorName"
          label="Contributor name"
          :disabled="anonymous"
          :placeholder="anonymous ? 'Anonymous contribution selected' : 'Enter contributor name'"
          :error="errors.contributorName"
        />
        <AppInput
          id="collector-phone"
          v-model="form.contributorPhone"
          label="Contributor phone"
          :disabled="anonymous"
          :placeholder="anonymous ? 'Phone number not required' : 'Enter contributor phone'"
          :error="errors.contributorPhone"
        />
        <AppInput
          id="collector-amount"
          v-model="form.amount"
          type="number"
          label="Amount"
          placeholder="0.00"
          :error="errors.amount"
        />
        <AppInput
          id="collector-currency"
          v-model="form.currency"
          label="Currency"
          :error="errors.currency"
        />
        <AppSelect
          id="collector-method"
          v-model="form.paymentMethod"
          label="Payment method"
          :options="paymentOptions"
        />
        <label class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2">
          <input
            v-model="anonymous"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-cyan-600"
          >
          Anonymous contribution
        </label>
        <div class="md:col-span-2">
          <AppTextarea
            id="collector-note"
            v-model="form.note"
            label="Note"
          />
        </div>
        <div class="md:col-span-2 rounded-[1.5rem] bg-slate-950 px-5 py-5 text-white">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Submission
              </p>
              <p class="mt-1 text-sm text-slate-300">
                The button unlocks only when the selected event, fund, amount, and contributor details are valid.
              </p>
            </div>
            <div class="md:w-72">
              <AppButton
                native-type="submit"
                size="lg"
                class="w-full"
                :loading="isSubmitting"
                :disabled="!canSubmit"
                aria-label="Submit collector cash contribution"
              >
                Issue receipt
              </AppButton>
            </div>
          </div>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { collectorContributionSchema } from '../validators/collectorValidators'
import { useAssignedEvents } from '../composables/useCollector'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import type { RecipientFund } from '@/modules/recipient-funds/types/recipientFund'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { ApiError } from '@/core/api/apiError'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'

const route = useRoute()
const router = useRouter()
const anonymous = ref(false)
const errors = ref<Record<string, string>>({})
const submissionError = ref<ApiError | null>(null)
const isSubmitting = ref(false)
const form = reactive({
  eventId: typeof route.query.eventId === 'string' ? route.query.eventId : '',
  recipientFundId: '',
  contributorName: '',
  contributorPhone: '',
  amount: '0',
  currency: 'GBP',
  note: '',
  paymentMethod: 'cash',
})

const eventsQuery = useAssignedEvents()
const fundsQuery = useQuery<RecipientFund[], ApiError>({
  queryKey: ['collector-recipient-funds', computed(() => form.eventId)],
  queryFn: () => recipientFundsService.listByEvent(form.eventId),
  enabled: computed(() => Boolean(form.eventId)),
  retry: false,
})

const eventOptions = computed(() => [
  { label: eventsQuery.isLoading.value ? 'Loading events…' : 'Select event', value: '' },
  ...(eventsQuery.data.value ?? []).map(event => ({
    label: event.title,
    value: event.id,
  })),
])

const fundOptions = computed(() => [
  { label: 'Select recipient fund', value: '' },
  ...(fundsQuery.data.value ?? []).map(fund => ({
    label: fund.name,
    value: fund.id,
  })),
])

const paymentOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Mobile money assisted', value: 'momo' },
  { label: 'Card assisted', value: 'card' },
]

const fundCreationPath = computed(() => `/admin/events/${form.eventId}/recipient-funds/new`)
const fundSelectDisabled = computed(
  () => eventsQuery.isLoading.value || fundsQuery.isLoading.value || !form.eventId || fundsQuery.isError.value,
)
const fundHelper = computed(() => {
  if (!form.eventId) {
    return {
      title: 'Recipient fund pending',
      message: 'Choose an event to load its recipient funds.',
      showCreateLink: false,
      classes: 'border-slate-200 bg-slate-50 text-slate-600',
    }
  }

  if (fundsQuery.isLoading.value) {
    return {
      title: 'Loading recipient funds',
      message: 'Fetching available funds for the selected event.',
      showCreateLink: false,
      classes: 'border-slate-200 bg-slate-50 text-slate-600',
    }
  }

  if (fundsQuery.isError.value) {
    return {
      title: 'Could not load recipient funds',
      message: `${fundsQuery.error.value?.message ?? 'Try again later.'}${fundsQuery.error.value?.correlationId ? ` Ref: ${fundsQuery.error.value.correlationId}` : ''}`,
      showCreateLink: false,
      classes: 'border-rose-200 bg-rose-50 text-rose-700',
    }
  }

  if ((fundsQuery.data.value?.length ?? 0) === 0) {
    return {
      title: 'No recipient funds found for this event',
      message: 'Create a recipient fund in admin before recording a contribution against this event.',
      showCreateLink: true,
      classes: 'border-amber-200 bg-amber-50 text-amber-800',
    }
  }

  return {
    title: '',
    message: '',
    showCreateLink: false,
    classes: '',
  }
})
const canSubmit = computed(() => {
  const validationResult = collectorContributionSchema.safeParse({
    ...form,
    anonymous: anonymous.value,
  })

  return validationResult.success && !isSubmitting.value && !fundSelectDisabled.value
})

watch(
  () => form.eventId,
  () => {
    form.recipientFundId = ''
    submissionError.value = null
  },
)

watch(anonymous, value => {
  if (value) {
    form.contributorName = ''
    form.contributorPhone = ''
    delete errors.value.contributorName
    delete errors.value.contributorPhone
  }
})

async function onSubmit() {
  errors.value = {}
  submissionError.value = null
  const result = collectorContributionSchema.safeParse({
    ...form,
    anonymous: anonymous.value,
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  try {
    isSubmitting.value = true
    const response = await contributionsService.recordCash({
      eventId: form.eventId,
      recipientFundId: form.recipientFundId,
      amount: Number(form.amount),
      contributorName: anonymous.value ? 'Anonymous' : form.contributorName.trim(),
      note: form.note,
    })

    if (!response.receiptId) {
      throw new Error('Receipt ID was not returned by the backend.')
    }

    await router.push(`/collector/receipts/${response.receiptId}`)
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
