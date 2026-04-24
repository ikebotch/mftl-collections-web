<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-10"
      @keydown.esc="$emit('close')"
    >
      <div
        class="absolute inset-0"
        @click="$emit('close')"
      />
      <div
        ref="panel"
        class="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2
              :id="titleId"
              class="text-lg font-semibold text-slate-950"
            >
              {{ title }}
            </h2>
            <p
              v-if="description"
              class="mt-1 text-sm text-slate-500"
            >
              {{ description }}
            </p>
          </div>
          <AppButton
            variant="ghost"
            aria-label="Close modal"
            @click="$emit('close')"
          >
            Close
          </AppButton>
        </div>
        <div class="mt-6">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
  }>(),
  {
    description: '',
  },
)

defineEmits<{
  close: []
}>()

const panel = ref<HTMLElement | null>(null)
const titleId = computed(() => `modal-title-${props.title.toLowerCase().replace(/\s+/g, '-')}`)

watch(
  () => props.open,
  async (value) => {
    if (value) {
      await nextTick()
      panel.value?.focus()
    }
  },
)
</script>
