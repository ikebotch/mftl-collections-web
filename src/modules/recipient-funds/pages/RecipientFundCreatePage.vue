<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Create recipient fund"
      description="Define a recipient fund for the selected event."
    />

    <AppCard class="max-w-3xl">
      <form
        class="space-y-5"
        @submit.prevent="onSubmit"
      >
        <AppInput
          id="recipient-name"
          v-model="form.name"
          label="Recipient fund name"
          placeholder="Example: School supplies"
          :error="errors.name"
        />
        <AppTextarea
          id="description"
          v-model="form.description"
          label="Description"
          placeholder="Briefly describe what this fund is for..."
          :error="errors.description"
        />
        <AppInput
          id="recipient-target"
          v-model="form.targetAmount"
          type="number"
          label="Target amount"
          placeholder="5000"
          :error="errors.targetAmount"
        />

        <ErrorState
          v-if="mutation.isError.value"
          title="Recipient fund creation failed"
          :message="mutation.error.value?.message ?? 'Please try again.'"
        />

        <div class="flex flex-wrap justify-end gap-3">
          <AppButton
            variant="secondary"
            @click="router.push(`/admin/events/${eventId}/recipient-funds`)"
          >
            Cancel
          </AppButton>
          <AppButton
            native-type="submit"
            :loading="mutation.isPending.value"
          >
            Create recipient fund
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { useCreateRecipientFund } from '../composables/useRecipientFunds'
import { createRecipientFundSchema } from '../validators/recipientFundValidators'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => String(route.params.id ?? ''))
const mutation = useCreateRecipientFund(eventId.value)

const form = reactive({
  name: '',
  description: '',
  targetAmount: '0',
})

const errors = ref<Record<string, string>>({})

async function onSubmit() {
  errors.value = {}
  const result = createRecipientFundSchema.safeParse({
    eventId: eventId.value,
    name: form.name,
    description: form.description,
    targetAmount: form.targetAmount,
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  await mutation.mutateAsync(result.data)
  await router.push(`/admin/events/${eventId.value}/recipient-funds`)
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
