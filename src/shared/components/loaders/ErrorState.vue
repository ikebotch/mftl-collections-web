<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center text-3xl mb-6 shadow-sm border border-rose-100">
      ⚠️
    </div>
    <h2 class="text-2xl font-bold text-slate-900 font-display">
      {{ title }}
    </h2>
    <p class="mx-auto mt-3 max-w-sm text-sm text-slate-400 font-medium">
      {{ message }}
    </p>
    <div
      v-if="showRetry"
      class="mt-8 flex justify-center"
    >
      <AppButton
        variant="danger"
        @click="$emit('retry')"
      >
        Try Again
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
