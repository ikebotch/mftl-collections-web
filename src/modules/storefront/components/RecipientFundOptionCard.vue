<template>
  <button
    type="button"
    :class="[
      'w-full rounded-3xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
      selected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300',
    ]"
    :aria-pressed="selected ? 'true' : 'false'"
    @click="$emit('select')"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-950">
          {{ title }}
        </h3>
        <p class="mt-2 text-sm text-slate-500">
          {{ description }}
        </p>
      </div>
      <AppBadge :tone="selected ? 'success' : 'info'">
        {{ amount }}
      </AppBadge>
    </div>
  </button>
</template>

<script setup lang="ts">
import AppBadge from '@/shared/components/badges/AppBadge.vue'

defineProps<{
  title: string
  description: string
  amount: string
  selected: boolean
}>()

defineEmits<{
  select: []
}>()
</script>
