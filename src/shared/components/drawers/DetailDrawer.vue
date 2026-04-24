<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-400 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
      @click="close"
    />
  </Transition>

  <Transition
    enter-active-class="transition duration-500 ease-out transform"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-400 ease-in transform"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside 
      v-if="isOpen"
      class="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[101] flex flex-col"
    >
      <header class="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-slate-900 font-display leading-none">
            {{ title }}
          </h2>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
            {{ subtitle }}
          </p>
        </div>
        <button 
          class="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
          @click="close"
        >
          <X class="w-6 h-6" />
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-8">
        <slot />
      </div>

      <footer
        v-if="$slots.actions"
        class="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-4"
      >
        <slot name="actions" />
      </footer>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  subtitle?: string
}>()

const emit = defineEmits(['close'])
const close = () => emit('close')
</script>
