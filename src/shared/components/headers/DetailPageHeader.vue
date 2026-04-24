<template>
  <div class="mb-8">
    <button
      v-if="backTo"
      type="button"
      class="group mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-violet-600 transition-colors"
      @click="handleBack"
    >
      <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      Back to {{ backLabel || 'list' }}
    </button>

    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">
            {{ title }}
          </h1>
          <slot name="status" />
        </div>
        <p
          v-if="description"
          class="text-sm text-slate-600 font-medium max-w-2xl leading-relaxed"
        >
          {{ description }}
        </p>
      </div>

      <div
        v-if="$slots.actions"
        class="flex flex-wrap items-center gap-3"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  description?: string
  backTo?: string | object
  backLabel?: string
}>()

const router = useRouter()

function handleBack() {
  if (typeof props.backTo === 'string') {
    router.push(props.backTo)
  } else if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>
