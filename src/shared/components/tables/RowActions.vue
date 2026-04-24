<template>
  <div class="flex items-center justify-end gap-2">
    <template v-if="actions">
      <button
        v-for="action in actions"
        :key="action.label"
        type="button"
        class="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90"
        @click.stop="action.onClick"
        :title="action.label"
      >
        <component :is="getIcon(action.icon)" class="w-4 h-4" />
      </button>
    </template>
    <slot />
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

interface Action {
  label: string
  icon: string
  onClick: () => void
}

defineProps<{
  actions?: Action[]
}>()

function getIcon(name: string) {
  return (icons as any)[name] || icons.HelpCircle
}
</script>
