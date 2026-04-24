<template>
  <div class="border-b border-slate-100 mb-8">
    <nav
      class="-mb-px flex space-x-8"
      aria-label="Tabs"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="whitespace-nowrap py-4 px-1 border-b-2 font-display font-bold text-xs uppercase tracking-[0.2em] transition-all"
        :class="[
          modelValue === tab.key
            ? 'border-violet-600 text-violet-600'
            : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
        ]"
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  key: string
  label: string
}

defineProps<{
  tabs: Tab[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [key: string]
}>()
</script>
