<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40"
        @click="$emit('close')"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-400 ease-out transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-300 ease-in transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 class="text-lg font-bold text-slate-900 font-display">
              {{ title }}
            </h2>
            <p
              v-if="subtitle"
              class="text-xs font-medium text-slate-500"
            >
              {{ subtitle }}
            </p>
          </div>
          <button
            class="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
            @click="$emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="px-6 py-4 border-t border-slate-100 bg-slate-50"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  subtitle?: string
}>()

defineEmits<{
  close: []
}>()
</script>
