<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Collector"
      title="Assigned events"
      description="Tap through to move quickly into contribution capture."
    />
    <AppTable
      caption="Assigned events"
      :columns="columns"
      :rows="query.data.value ?? []"
      row-key="id"
    >
      <template #cell:actions="{ row }">
        <AppButton
          size="sm"
          @click="router.push(`/collector/events/${getRowValue(row, 'id')}`)"
        >
          Open
        </AppButton>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAssignedEvents } from '../composables/useCollector'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import AppTable from '@/shared/components/tables/AppTable.vue'

const router = useRouter()
const query = useAssignedEvents()
const columns = [
  { key: 'title', label: 'Event' },
  { key: 'location', label: 'Location' },
  { key: 'shift', label: 'Shift' },
  { key: 'actions', label: 'Actions' },
]

function getRowValue(row: unknown, key: string): string {
  if (row && typeof row === 'object') {
    return String((row as Record<string, unknown>)[key] ?? '')
  }

  return ''
}
</script>
