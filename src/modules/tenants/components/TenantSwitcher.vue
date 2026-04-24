<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <label
      class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
      for="tenant-switcher"
    >
      Tenant context
    </label>
    <AppSelect
      id="tenant-switcher"
      v-model="selectedValue"
      label="Tenant context"
      sr-only
      :options="tenantOptions"
      @update:model-value="handleSelect"
    />
    <p class="mt-2 text-sm text-slate-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppSelect, { type SelectOption } from '@/shared/components/forms/AppSelect.vue'
import { useTenantStore } from '../store/tenantStore'

const tenantStore = useTenantStore()

const tenantOptions: SelectOption[] = [
  { label: 'Select tenant', value: '' },
  { label: 'Community Collections', value: 'community-collections' },
  { label: 'Faith Fundraisers', value: 'faith-fundraisers' },
  { label: 'Family Support Circles', value: 'family-support-circles' },
]

const selectedValue = computed({
  get: () => tenantStore.selectedTenantId,
  set: (value: string) => {
    handleSelect(value)
  },
})

const helperText = computed(() =>
  tenantStore.selectedTenantName
    ? `Requests will include the configured tenant header for ${tenantStore.selectedTenantName}.`
    : 'Choose a tenant to simulate tenant-aware admin requests.',
)

function handleSelect(value: string) {
  const match = tenantOptions.find((option) => option.value === value)

  if (!match || !value) {
    tenantStore.clearTenant()
    return
  }

  tenantStore.setTenant(value, match.label)
}
</script>
