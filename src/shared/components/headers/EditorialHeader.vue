<template>
  <div class="flex items-center justify-between mb-12">
    <div class="space-y-1">
      <h3 
        v-if="subtitle"
        class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80"
      >
        {{ subtitle }}
      </h3>
      <h2 
        class="text-2xl font-black text-slate-900 tracking-tight uppercase"
        :class="{ 'italic': italic }"
      >
        {{ title }}
      </h2>
    </div>
    <div class="flex items-center gap-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  italic?: boolean
}>()
</script>
