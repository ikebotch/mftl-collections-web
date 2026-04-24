<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Collector"
      title="New cash contribution"
      description="Fast entry form for in-person assisted collections."
    />
    <AppCard>
      <form
        class="grid gap-6 md:grid-cols-2"
        @submit.prevent="onSubmit"
      >
        <AppSelect
          id="collector-event"
          v-model="form.eventId"
          label="Assigned event"
          :options="eventOptions"
          :error="errors.eventId"
        />
        <AppSelect
          id="collector-fund"
          v-model="form.recipientFundId"
          label="Recipient fund"
          :options="fundOptions"
          :error="errors.recipientFundId"
          :disabled="!form.eventId"
        />
        <AppInput
          id="collector-name"
          v-model="form.contributorName"
          label="Contributor name"
          placeholder="Anonymous"
          :error="errors.contributorName"
        />
        <AppInput
          id="collector-amount"
          v-model="form.amount"
          type="number"
          label="Amount"
          :error="errors.amount"
        />
        
        <div class="md:col-span-2">
          <AppTextarea
            id="collector-note"
            v-model="form.note"
            label="Note (Optional)"
            placeholder="Add a special note about this contribution..."
          />
        </div>

        <ErrorState
          v-if="mutation.isError.value"
          class="md:col-span-2"
          title="Contribution failed"
          :message="mutation.error.value?.message ?? 'Please check the details and try again.'"
          :correlation-id="mutation.error.value?.correlationId"
        />

        <div
          v-if="mutation.isSuccess.value"
          class="md:col-span-2 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 text-emerald-800"
        >
          <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check class="w-6 h-6" />
          </div>
          <div>
            <p class="font-bold text-lg">
              Contribution recorded!
            </p>
            <p class="text-sm opacity-90">
              The receipt has been issued and metrics updated.
            </p>
          </div>
        </div>

        <div class="md:col-span-2 flex justify-end gap-3 mt-4">
          <AppButton
            variant="secondary"
            @click="router.push('/collector')"
          >
            Cancel
          </AppButton>
          <AppButton
            native-type="submit"
            size="lg"
            :loading="mutation.isPending.value"
            :disabled="mutation.isSuccess.value"
          >
            <CircleDollarSign class="w-5 h-5 mr-2" />
            Issue receipt
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useAssignedEvents } from '../composables/useCollector'
import { useRecipientFunds } from '@/modules/recipient-funds/composables/useRecipientFunds'
import { useRecordCashContribution } from '@/modules/contributions/composables/useContributions'
import { collectorContributionSchema } from '../validators/collectorValidators'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { Check, CircleDollarSign } from 'lucide-vue-next'

const router = useRouter()
const mutation = useRecordCashContribution()
const eventsQuery = useAssignedEvents()

const form = reactive({
  eventId: '',
  recipientFundId: '',
  contributorName: '',
  amount: '0',
  note: '',
})

const errors = ref<Record<string, string>>({})

// Fetch funds when event changes
const fundsQuery = useRecipientFunds(computed(() => form.eventId))

watch(() => form.eventId, () => {
  form.recipientFundId = ''
})

const eventOptions = computed(() => [
  { label: 'Select assigned event', value: '' },
  ...(eventsQuery.data.value?.map(e => ({ label: e.title, value: e.id })) ?? [])
])

const fundOptions = computed(() => [
  { label: 'Select recipient fund', value: '' },
  ...(fundsQuery.data.value?.map(f => ({ label: f.name, value: f.id })) ?? [])
])

async function onSubmit() {
  errors.value = {}
  
  // Basic validation using the local schema first for UX
  const result = collectorContributionSchema.safeParse({
    eventId: form.eventId,
    recipientFundId: form.recipientFundId,
    contributorName: form.contributorName || 'Anonymous',
    contributorPhone: '0000000000', // Mocking phone as it's required by local schema but not backend
    amount: form.amount,
    currency: 'GBP',
    anonymous: !form.contributorName,
    note: form.note,
    paymentMethod: 'cash',
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  // Map to backend contract
  await mutation.mutateAsync({
    eventId: result.data.eventId,
    recipientFundId: result.data.recipientFundId,
    amount: result.data.amount,
    contributorName: result.data.contributorName,
    note: result.data.note,
  })

  // Optional: navigate away after success
  // setTimeout(() => router.push('/collector'), 2000)
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
