<template>
  <div class="space-y-6">
    <AdminPageHeader
      eyebrow="Admin"
      title="Recipient Funds"
      description="Manage designated funds, allocation targets, and distribution history."
    >
      <template #actions>
        <AppButton @click="router.push(`/admin/events/${eventId}/recipient-funds/new`)">
          Create recipient fund
        </AppButton>
      </template>
    </AdminPageHeader>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading recipient funds…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load recipient funds"
      :message="query.error.value?.message ?? 'Please retry.'"
      show-retry
      @retry="query.refetch"
    />
    <EmptyState
      v-else-if="!query.data.value?.length"
      title="No recipient funds"
      description="You haven't created any recipient funds for this event yet. Add your first fund to get started."
    >
      <template #action>
        <AppButton @click="router.push(`/admin/events/${eventId}/recipient-funds/new`)">
          Add recipient fund
        </AppButton>
      </template>
    </EmptyState>
    <div
      v-else
      class="grid gap-4"
    >
      <RecipientFundSummaryCard
        v-for="fund in query.data.value"
        :key="fund.id"
        :fund="fund"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipientFunds } from '../composables/useRecipientFunds'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import EmptyState from '@/shared/components/empty-states/EmptyState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import RecipientFundSummaryCard from '../components/RecipientFundSummaryCard.vue'

const route = useRoute()
const router = useRouter()
const eventId = computed(() => String(route.params.id ?? ''))
const query = useRecipientFunds(eventId.value)
</script>
