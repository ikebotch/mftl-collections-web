<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Contribution flow"
      title="Confirm contribution"
      description="Review the contribution details before the final payment handoff."
    />

    <AppCard>
      <div v-if="!slug" class="mb-6 p-10 text-center space-y-4">
        <p class="text-lg font-black text-slate-900">Missing giving link.</p>
        <p class="text-sm text-slate-500">Please restart from the giving page.</p>
        <AppButton @click="router.push('/')">Go to Home</AppButton>
      </div>

      <template v-else>
        <div v-if="flowStore.error" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
          <p class="text-sm font-bold text-red-600">{{ flowStore.error }}</p>
        </div>

        <dl class="grid gap-4 md:grid-cols-2">
          <!-- ... existing fields ... -->
          <div class="rounded-none bg-slate-50 p-4">
            <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Amount
            </dt>
            <dd class="mt-2 text-base font-semibold text-slate-950">
              {{ formatCurrency(flowStore.draft.amount) }}
            </dd>
          </div>
          <div class="rounded-none bg-slate-50 p-4">
            <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Payment Method
            </dt>
            <dd class="mt-2 text-base font-semibold capitalize text-slate-950">
              {{ flowStore.draft.paymentMethod }}
              <span v-if="flowStore.draft.paymentMethod === 'momo' && flowStore.draft.donorNetwork" class="text-slate-400 font-normal">
                ({{ flowStore.draft.donorNetwork.toUpperCase() }})
              </span>
            </dd>
          </div>
          <div class="rounded-none bg-slate-50 p-4 md:col-span-2">
            <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Contributor
            </dt>
            <dd class="mt-2 text-base font-semibold text-slate-950">
              {{ flowStore.draft.anonymous ? 'Anonymous contributor' : flowStore.draft.contributorName }}
            </dd>
            <dd v-if="!flowStore.draft.anonymous" class="text-xs text-slate-500 mt-1">
              {{ flowStore.draft.contributorPhone }} {{ flowStore.draft.contributorEmail ? '• ' + flowStore.draft.contributorEmail : '' }}
            </dd>
          </div>
        </dl>
        <div class="mt-6 flex justify-between gap-3">
          <AppButton
            variant="secondary"
            @click="router.push(`/give/${slug}`)"
          >
            Back
          </AppButton>
          <AppButton
            :loading="flowStore.isSubmitting"
            @click="flowStore.submit(slug)"
          >
            Confirm contribution
          </AppButton>
        </div>
      </template>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import { formatCurrency } from '@/core/formatting/formatters'

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.eventSlug || '').trim())
const flowStore = useContributionFlowStore()
</script>
