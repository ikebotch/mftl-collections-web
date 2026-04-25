<template>
  <div class="border-b border-slate-200 mb-8">
    <nav
      class="-mb-px flex space-x-12"
      aria-label="Tabs"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="whitespace-nowrap py-5 px-1 border-b-2 font-display font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center gap-3"
        :class="[
          modelValue === tab.key
            ? 'border-violet-600 text-violet-600'
            : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
        ]"
        @click="$emit('update:modelValue', tab.key)"
      >
        <component 
          v-if="tab.icon"
          :is="resolvedIcon(tab.icon)" 
          class="w-3.5 h-3.5"
          :class="modelValue === tab.key ? 'text-violet-600' : 'text-slate-300'"
        />
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import * as Icons from 'lucide-vue-next'

interface Tab {
  key: string
  label: string
  icon?: string
}

defineProps<{
  tabs: Tab[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [key: string]
}>()

function resolvedIcon(iconName: string) {
  return (Icons as any)[iconName] || null
}
</script>
