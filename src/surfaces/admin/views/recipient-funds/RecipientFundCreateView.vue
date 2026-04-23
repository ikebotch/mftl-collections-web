<template>
  <div>
    <PageHeader
      title="Create Recipient Fund"
      description="Add a new fund to collect contributions for this event."
    />

    <div class="max-w-2xl">
      <AppCard>
        <ErrorState
          v-if="isError"
          title="Failed to create recipient fund"
          :message="error?.message"
          class="mb-6"
        />
        
        <form
          class="space-y-6"
          @submit.prevent="onSubmit"
        >
          <AppInput
            id="name"
            v-model="form.name"
            label="Fund Name"
            placeholder="e.g. Local Food Bank"
            :error="validationErrors.name"
          />
          
          <AppInput
            id="description"
            v-model="form.description"
            label="Description"
            placeholder="Brief description of the fund's purpose"
          />
          
          <AppInput
            id="targetAmount"
            v-model.number="form.targetAmount"
            label="Target Amount (£)"
            type="number"
            :error="validationErrors.targetAmount"
          />

          <div class="flex justify-end gap-x-3 pt-4 border-t border-gray-100">
            <AppButton
              type="button"
              variant="ghost"
              @click="$router.push(`/admin/events/${eventId}`)"
            >
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              :loading="isPending"
            >
              Create Fund
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { recipientFundsApi } from '../../../../modules/recipient-funds/services/recipientFundsApi'
import { CreateRecipientFundSchema, type CreateRecipientFundRequest } from '../../../../modules/recipient-funds/models/recipientFund'
import PageHeader from '../../../../shared/components/layout/PageHeader.vue'
import AppCard from '../../../../shared/components/ui/AppCard.vue'
import AppInput from '../../../../shared/components/ui/AppInput.vue'
import AppButton from '../../../../shared/components/ui/AppButton.vue'
import ErrorState from '../../../../shared/components/feedback/ErrorState.vue'

const router = useRouter()
const route = useRoute()
const queryClient = useQueryClient()

const eventId = route.params.id as string

const form = reactive({
  eventId: eventId,
  name: '',
  description: '',
  targetAmount: 0
})

const validationErrors = ref<Record<string, string>>({})

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: (data: CreateRecipientFundRequest) => recipientFundsApi.createFund(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['events', eventId, 'funds'] })
    router.push(`/admin/events/${eventId}`)
  }
})

function onSubmit() {
  validationErrors.value = {}
  
  const result = CreateRecipientFundSchema.safeParse(form)
  
  if (!result.success) {
    for (const err of result.error.issues) {
      if (err.path[0]) {
        validationErrors.value[err.path[0].toString()] = err.message
      }
    }
    return
  }

  mutate(result.data)
}
</script>
