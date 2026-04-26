<template>
  <div class="bg-white rounded-none border border-slate-100 p-6 shadow-sm shadow-slate-200/50">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
        {{ title }}
      </h3>
      <slot name="action" />
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
      <div
        v-for="item in items"
        :key="item.label"
        class="space-y-1"
      >
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {{ item.label }}
        </p>
        <div class="text-sm font-bold text-slate-900">
          <slot
            :name="`item:${item.key}`"
            :value="item.value"
          >
            {{ item.value || '—' }}
          </slot>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface SummaryItem {
  key: string
  label: string
  value: any
}

defineProps<{
  title: string
  items: SummaryItem[]
}>()
</script>
