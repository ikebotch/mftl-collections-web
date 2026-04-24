<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Contribution flow"
      title="Contributor details"
      description="Add the contributor details, or mark the gift as anonymous."
    />

    <AppCard class="max-w-3xl">
      <form
        class="space-y-5"
        @submit.prevent="onSubmit"
      >
        <label class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            v-model="anonymous"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-teal-500"
          >
          <span class="text-sm font-medium text-slate-700">Make this an anonymous contribution</span>
        </label>

        <AppInput
          id="contributor-name"
          v-model="contributorName"
          label="Contributor name"
          placeholder="Jane Doe"
          :error="errors.contributorName"
        />
        <AppInput
          id="contributor-phone"
          v-model="contributorPhone"
          label="Phone number"
          placeholder="+44..."
          :error="errors.contributorPhone"
        />
        <AppInput
          id="contributor-email"
          v-model="contributorEmail"
          label="Email address"
          placeholder="name@example.com"
          :error="errors.contributorEmail"
        />
        <AppTextarea
          id="contributor-note"
          v-model="note"
          label="Message or note"
          placeholder="Optional encouragement or dedication"
          :error="errors.note"
        />
        <div class="flex justify-between gap-3">
          <AppButton
            variant="secondary"
            @click="router.push(`/contribute/${eventSlug}/recipient`)"
          >
            Back
          </AppButton>
          <AppButton native-type="submit">
            Continue to payment
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { contributorDetailsSchema } from '../validators/storefrontValidators'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const flowStore = useContributionFlowStore()

const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const contributorName = ref(flowStore.draft.contributorName)
const contributorPhone = ref(flowStore.draft.contributorPhone)
const contributorEmail = ref(flowStore.draft.contributorEmail)
const anonymous = ref(flowStore.draft.anonymous)
const note = ref(flowStore.draft.note)
const errors = ref<Record<string, string>>({})

function onSubmit() {
  errors.value = {}
  const result = contributorDetailsSchema.safeParse({
    contributorName: contributorName.value,
    contributorPhone: contributorPhone.value,
    contributorEmail: contributorEmail.value,
    anonymous: anonymous.value,
    note: note.value,
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  flowStore.patch(result.data)
  void router.push(`/contribute/${eventSlug.value}/payment`)
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
