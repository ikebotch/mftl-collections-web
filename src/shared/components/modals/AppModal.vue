<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-10"
      @keydown.esc="$emit('close')"
    >
      <div
        class="absolute inset-0"
        @click="$emit('close')"
      />
      <div
        ref="panel"
        class="relative z-10 w-full max-w-lg rounded-none bg-white border border-slate-200 shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2
              :id="titleId"
              class="text-xl font-black text-slate-900 tracking-tight leading-none uppercase"
            >
              {{ title }}
            </h2>
            <p
              v-if="subtitle || description"
              class="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none"
            >
              {{ subtitle || description }}
            </p>
          </div>
          <button
            class="text-slate-400 hover:text-slate-900 transition-colors"
            @click="$emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-8 overflow-y-auto max-h-[70vh]">
          <slot />
        </div>

        <!-- Modal Footer -->
        <div v-if="$slots.actions" class="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    open?: boolean
    title: string
    subtitle?: string
    description?: string
  }>(),
  {
    open: true, // Default to true if used with v-if
    description: '',
    subtitle: '',
  },
)

const emit = defineEmits<{
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
  { immediate: true }
)
</script>
