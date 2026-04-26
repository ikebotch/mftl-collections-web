<template>
  <div class="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
    <TransitionGroup
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto w-full max-w-sm overflow-hidden bg-slate-900 shadow-premium border-l-4 border-violet-500 p-5 flex items-center gap-4 animate-in fade-in slide-in-from-right-10 duration-500"
        :class="typeClasses(toast.type)"
      >
        <div class="shrink-0">
          <CheckCircle
            v-if="toast.type === 'success'"
            class="w-5 h-5 text-emerald-400"
          />
          <AlertCircle
            v-else-if="toast.type === 'error'"
            class="w-5 h-5 text-rose-400"
          />
          <Info
            v-else
            class="w-5 h-5 text-blue-400"
          />
        </div>
        <div class="flex-1">
          <p class="text-[11px] font-black uppercase tracking-[0.15em] text-white">
            {{ toast.message }}
          </p>
        </div>
        <button 
          class="text-slate-500 hover:text-white transition-colors"
          @click="toastStore.remove(toast.id)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/shared/stores/useToastStore'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()

function typeClasses(type: string) {
  switch (type) {
    case 'success': return 'border-emerald-500'
    case 'error': return 'border-rose-500'
    default: return 'border-violet-500'
  }
}
</script>
