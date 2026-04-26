<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-6 border border-rose-100 shadow-sm">
      <AlertCircle class="w-8 h-8" />
    </div>
    <h2 class="text-xl font-bold text-slate-900">
      {{ title }}
    </h2>
    <p class="mx-auto mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
      {{ message }}
    </p>
    
    <div
      v-if="correlationId"
      class="mt-4 px-3 py-1.5 bg-slate-100 rounded-none inline-block"
    >
      <p class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
        Ref: {{ correlationId }}
      </p>
    </div>

    <div
      v-if="showRetry"
      class="mt-8"
    >
      <AppButton
        variant="primary"
        class="bg-rose-600 hover:bg-rose-700 !shadow-rose-600/20"
        @click="$emit('retry')"
      >
        Try Again
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import AppButton from '@/shared/components/buttons/AppButton.vue'

withDefaults(
  defineProps<{
    title: string
    message: string
    showRetry?: boolean
    correlationId?: string
  }>(),
  {
    showRetry: false,
    correlationId: '',
  },
)

defineEmits<{
  retry: []
}>()
</script>
