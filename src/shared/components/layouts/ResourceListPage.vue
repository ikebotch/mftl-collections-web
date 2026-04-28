<template>
  <div class="space-y-10">
    <!-- Header Section -->
    <AdminPageHeader
      :title="title"
      :description="description"
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <slot name="headerActions">
            <AppButton
              v-if="exportable"
              variant="outline"
              class="bg-transparent border-slate-200"
              @click="$emit('export')"
            >
              <Download class="w-4 h-4 mr-2 text-slate-400" />
              Export
            </AppButton>
            <AppButton
              v-if="newResourcePath"
              variant="primary"
              @click="router.push(newResourcePath)"
            >
              <Plus class="w-4 h-4 mr-2" />
              {{ newResourceLabel || 'Create New' }}
            </AppButton>
          </slot>
        </div>
      </template>
    </AdminPageHeader>

    <!-- Metrics Section -->
    <AdminMetricGrid v-if="metrics && metrics.length">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.label"
        v-bind="metric"
      />
    </AdminMetricGrid>

    <!-- Data Section -->
    <div class="space-y-6">
      <AdminFilterBar
        v-model="search"
        :placeholder="searchPlaceholder || 'Search...'"
      >
        <template #sections>
          <slot name="filters" />
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="items"
        :loading="loading"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        :expandable="expandable"
        exportable
        @sort="onSort"
        @retry="$emit('retry')"
      >
        <!-- Pass through all DataTable slots -->
        <template
          v-for="(_, slotName) in $slots"
          #[slotName]="slotProps"
        >
          <slot
            :name="slotName"
            v-bind="slotProps"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminMetricGrid from '@/shared/components/cards/AdminMetricGrid.vue'
import MetricCard from '@/shared/components/cards/MetricCard.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { Plus, Download } from 'lucide-vue-next'

interface Metric {
  label: string
  value: string
  icon: any
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'rose' | 'slate'
  trend?: string
  trendValue?: string
}

const props = defineProps<{
  title: string
  description?: string
  metrics?: Metric[]
  columns: any[]
  items: any[]
  loading?: boolean
  searchPlaceholder?: string
  newResourcePath?: string
  newResourceLabel?: string
  exportable?: boolean
  expandable?: boolean
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
}>()

const emit = defineEmits(['update:search', 'sort', 'retry', 'export'])

const router = useRouter()

const search = computed({
  get: () => '', // Placeholder for v-model logic if needed
  set: (val) => emit('update:search', val)
})

function onSort(key: string) {
  emit('sort', key)
}
</script>
