<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Collector"
      title="New cash contribution"
      description="Fast entry form for in-person assisted collections."
    />
    <AppCard>
      <ErrorState
        v-if="submissionError"
        title="Could not record contribution"
        :message="submissionError.message"
        :correlation-id="submissionError.correlationId"
      />
      <form
        class="grid gap-4 md:grid-cols-2"
        @submit.prevent="onSubmit"
      >
        <AppSelect
          id="collector-event"
          v-model="form.eventId"
          label="Assigned event"
          :options="eventOptions"
          :disabled="eventsQuery.isLoading.value"
          :error="errors.eventId"
        />
        <AppSelect
          id="collector-fund"
          v-model="form.recipientFundId"
          label="Recipient fund"
          :options="fundOptions"
          :disabled="fundsQuery.isLoading.value || !form.eventId"
          :error="errors.recipientFundId"
        />
        <AppInput
          id="collector-name"
          v-model="form.contributorName"
          label="Contributor name"
          :error="errors.contributorName"
        />
        <AppInput
          id="collector-phone"
          v-model="form.contributorPhone"
          label="Contributor phone"
          :error="errors.contributorPhone"
        />
        <AppInput
          id="collector-amount"
          v-model="form.amount"
          type="number"
          label="Amount"
          :error="errors.amount"
        />
        <AppInput
          id="collector-currency"
          v-model="form.currency"
          label="Currency"
        />
        <AppSelect
          id="collector-method"
          v-model="form.paymentMethod"
          label="Payment method"
          :options="paymentOptions"
        />
        <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm md:col-span-2">
          <input
            v-model="anonymous"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-cyan-300"
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
        <div class="md:col-span-2 flex justify-end">
          <AppButton
            native-type="submit"
            size="lg"
            :loading="isSubmitting"
          >
            Issue receipt
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { collectorContributionSchema } from '../validators/collectorValidators'
import { useAssignedEvents } from '../composables/useCollector'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { ApiError } from '@/core/api/apiError'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const router = useRouter()
const anonymous = ref(false)
const errors = ref<Record<string, string>>({})
const submissionError = ref<ApiError | null>(null)
const isSubmitting = ref(false)
const form = reactive({
  eventId: '',
  recipientFundId: '',
  contributorName: '',
  contributorPhone: '',
  amount: '0',
  currency: 'GBP',
  note: '',
  paymentMethod: 'cash',
})

const eventsQuery = useAssignedEvents()
const fundsQuery = useQuery({
  queryKey: ['collector-recipient-funds', computed(() => form.eventId)],
  queryFn: () => recipientFundsService.listByEvent(form.eventId),
  enabled: computed(() => Boolean(form.eventId)),
})

const eventOptions = computed(() => [
  { label: 'Select event', value: '' },
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

watch(
  () => form.eventId,
  () => {
    form.recipientFundId = ''
  },
)

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
      contributorName: anonymous.value ? 'Anonymous' : form.contributorName,
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
