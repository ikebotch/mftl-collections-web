<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Collector"
      title="New cash contribution"
      description="Fast entry form for in-person assisted collections."
    />
    <AppCard>
      <form
        class="grid gap-4 md:grid-cols-2"
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
          >
            Issue receipt
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { collectorContributionSchema } from '../validators/collectorValidators'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const router = useRouter()
const anonymous = ref(false)
const errors = ref<Record<string, string>>({})
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

const eventOptions = [
  { label: 'Select event', value: '' },
  { label: 'Community fundraiser', value: 'event-1' },
  { label: 'Evening appeal', value: 'event-2' },
]
const fundOptions = [
  { label: 'Select recipient fund', value: '' },
  { label: 'Medical support', value: 'fund-1' },
  { label: 'Education costs', value: 'fund-2' },
]
const paymentOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Mobile money assisted', value: 'momo' },
  { label: 'Card assisted', value: 'card' },
]

function onSubmit() {
  errors.value = {}
  const result = collectorContributionSchema.safeParse({
    ...form,
    anonymous: anonymous.value,
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  void router.push('/collector/receipts/preview')
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
