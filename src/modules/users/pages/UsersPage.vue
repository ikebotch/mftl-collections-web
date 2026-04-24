<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Admin"
      title="Users"
      description="Review access placeholders for admins, collectors, and future scoped roles."
    >
      <template #actions>
        <AppButton>Invite user</AppButton>
      </template>
    </PageHeader>

    <AppTable
      caption="Users table"
      :columns="columns"
      :rows="query.data.value ?? []"
      row-key="id"
    >
      <template #cell:role="{ value }">
        <AppBadge tone="info">
          {{ value }}
        </AppBadge>
      </template>
      <template #cell:scope="{ value }">
        <AppBadge tone="neutral">
          {{ value }}
        </AppBadge>
      </template>
    </AppTable>

    <InviteUserPlaceholder />
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '../composables/useUsers'
import InviteUserPlaceholder from '../components/InviteUserPlaceholder.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'
import AppBadge from '@/shared/components/badges/AppBadge.vue'

const query = useUsers()

const columns = [
  { key: 'name', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'scope', label: 'Scope' },
]
</script>
