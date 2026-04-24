<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Create event"
      description="Set up the event details before you start collecting public contributions."
    />

    <AppCard class="max-w-3xl">
      <form
        class="space-y-5"
        @submit.prevent="onSubmit"
      >
        <AppInput
          id="event-title"
          v-model="form.title"
          label="Event title"
          placeholder="Example: Family support concert"
          :error="errors.title"
        />
        <AppTextarea
          id="event-description"
          v-model="form.description"
          label="Description"
          placeholder="Explain what the collection is for and who it supports."
          :error="errors.description"
        />
        <AppInput
          id="event-date"
          v-model="form.eventDate"
          label="Event date"
          type="date"
        />

        <ErrorState
          v-if="mutation.isError.value"
          title="Event creation failed"
          :message="mutation.error.value?.message ?? 'Please review the form and try again.'"
        />

        <div class="flex flex-wrap justify-end gap-3">
          <AppButton
            variant="secondary"
            @click="router.push('/admin/events')"
          >
            Cancel
          </AppButton>
          <AppButton
            native-type="submit"
            :loading="mutation.isPending.value"
          >
            Create event
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
import { useCreateEvent } from '../composables/useEvents'
import { createEventSchema } from '../validators/eventValidators'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'

const router = useRouter()
const mutation = useCreateEvent()

const form = reactive({
  title: '',
  description: '',
  eventDate: '',
})

const errors = ref<Record<string, string>>({})

async function onSubmit() {
  errors.value = {}
  const result = createEventSchema.safeParse({
    title: form.title,
    description: form.description,
    eventDate: form.eventDate || null,
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  const event = await mutation.mutateAsync(result.data)
  await router.push(`/admin/events/${event.id}`)
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '')
    errors.value[key] = issue.message
  }
}
</script>
