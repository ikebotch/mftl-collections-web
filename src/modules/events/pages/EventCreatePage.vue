<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <div class="mb-10">
      <div class="flex items-center gap-2 text-brand-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
        <span class="w-8 h-px bg-brand-600/30" />
        Admin Dashboard
      </div>
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
        Create New Event
      </h1>
      <p class="text-slate-500 mt-3 font-medium text-lg">
        Set up the event details before you start collecting public contributions.
      </p>
    </div>

    <AppCard class="overflow-hidden border-none shadow-premium !p-0">
      <form
        class="flex flex-col h-full"
        @submit.prevent="onSubmit"
      >
        <div class="p-10 space-y-10">
          <div class="grid gap-10">
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
              :rows="5"
            />

            <div class="grid md:grid-cols-2 gap-8">
              <AppInput
                id="event-date"
                v-model="form.eventDate"
                label="Event date"
                type="date"
              />
            </div>
          </div>

          <ErrorState
            v-if="mutation.isError.value"
            title="Event creation failed"
            :message="mutation.error.value?.message ?? 'Please review the form and try again.'"
          />
        </div>

        <div class="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <AppButton
            variant="secondary"
            class="min-w-[120px]"
            @click="router.push('/admin/events')"
          >
            Cancel
          </AppButton>
          <AppButton
            native-type="submit"
            class="min-w-[160px]"
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
