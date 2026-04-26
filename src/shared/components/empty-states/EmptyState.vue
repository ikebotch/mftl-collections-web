<template>
  <div class="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-slate-100 rounded-none bg-slate-50/30">
    <div class="w-16 h-16 rounded-none bg-white flex items-center justify-center text-slate-300 mb-6 shadow-sm border border-slate-100">
      <component
        :is="resolvedIcon"
        class="w-8 h-8"
      />
    </div>
    
    <p
      v-if="eyebrow"
      class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-2"
    >
      {{ eyebrow }}
    </p>
    
    <h2 class="text-xl font-bold text-slate-900 font-display">
      {{ title }}
    </h2>
    
    <p class="mx-auto mt-2 max-w-sm text-sm text-slate-500 font-medium leading-relaxed">
      {{ description }}
    </p>

    <div
      v-if="$slots.action"
      class="mt-8 flex justify-center"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as Icons from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    eyebrow?: string
    icon?: string
  }>(),
  {
    eyebrow: 'Nothing here yet',
    icon: 'Inbox'
  },
)

const resolvedIcon = computed(() => (Icons as any)[props.icon] || Icons.Inbox)
</script>
