<template>
  <div>
    <PageHeader
      title="Create Event"
      description="Set up a new collection event."
    />

    <div class="max-w-2xl">
      <AppCard>
        <ErrorState
          v-if="isError"
          title="Failed to create event"
          :message="error?.message"
          class="mb-6"
        />
        
        <form
          class="space-y-6"
          @submit.prevent="onSubmit"
        >
          <AppInput
            id="title"
            v-model="form.title"
            label="Event Title"
            placeholder="e.g. Summer Gala 2026"
            :error="validationErrors.title"
          />
          
          <AppInput
            id="description"
            v-model="form.description"
            label="Description"
            placeholder="Brief description of the event"
          />
          
          <AppInput
            id="eventDate"
            v-model="form.eventDate"
            label="Event Date"
            type="date"
          />

          <div class="flex justify-end gap-x-3 pt-4 border-t border-gray-100">
            <AppButton
              type="button"
              variant="ghost"
              @click="$router.push('/admin/events')"
            >
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              :loading="isPending"
            >
              Create Event
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { eventsApi } from '../../../../modules/events/services/eventsApi'
import { CreateEventSchema, type CreateEventRequest } from '../../../../modules/events/models/event'
import PageHeader from '../../../../shared/components/layout/PageHeader.vue'
import AppCard from '../../../../shared/components/ui/AppCard.vue'
import AppInput from '../../../../shared/components/ui/AppInput.vue'
import AppButton from '../../../../shared/components/ui/AppButton.vue'
import ErrorState from '../../../../shared/components/feedback/ErrorState.vue'

const router = useRouter()
const queryClient = useQueryClient()

const form = reactive({
  title: '',
  description: '',
  eventDate: ''
})

const validationErrors = ref<Record<string, string>>({})

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: (data: CreateEventRequest) => eventsApi.createEvent(data),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['events'] })
    router.push(`/admin/events/${data.id}`)
  }
})

function onSubmit() {
  validationErrors.value = {}
  
  const payload = {
    ...form,
    eventDate: form.eventDate || null
  }
  
  const result = CreateEventSchema.safeParse(payload)
  
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
