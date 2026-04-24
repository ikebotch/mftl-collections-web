<template>
  <div class="rounded-3xl border border-rose-200 bg-rose-50 p-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-rose-900">
          {{ title }}
        </h2>
        <p class="mt-2 text-sm text-rose-700">
          {{ message }}
        </p>
      </div>
      <AppButton
        v-if="showRetry"
        variant="danger"
        @click="$emit('retry')"
      >
        Retry
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/shared/components/buttons/AppButton.vue'

withDefaults(
  defineProps<{
    title: string
    message: string
    showRetry?: boolean
  }>(),
  {
    showRetry: false,
  },
)

defineEmits<{
  retry: []
}>()
</script>
