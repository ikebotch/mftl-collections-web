<template>
  <div class="relative min-w-[240px]">
    <label
      class="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1"
      for="tenant-switcher"
    >
      Active Ministry
    </label>
    <AppSelect
      id="tenant-switcher"
      v-model="selectedValue"
      label="Tenant context"
      sr-only
      :options="tenantOptions"
      @update:model-value="handleSelect"
    />
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

function handleSelect(value: string) {
  const match = tenantOptions.find((option) => option.value === value)

  if (!match || !value) {
    tenantStore.clearTenant()
    return
  }

  tenantStore.setTenant(value, match.label)
}
</script>
