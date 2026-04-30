<template>
  <button
    type="button"
    :class="[
      'w-full border-2 p-8 text-left transition-all duration-500 group relative overflow-hidden',
      selected 
        ? 'border-violet-600 ring-4 ring-violet-500/5 shadow-xl' 
        : 'border-slate-100 hover:border-slate-200 bg-transparent shadow-sm hover:shadow-md',
    ]"
    :aria-pressed="selected ? 'true' : 'false'"
    @click="$emit('select')"
  >
    <div 
      v-if="selected"
      class="absolute top-0 right-0 p-4"
    >
      <div class="w-6 h-6 rounded-none bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
        <span class="text-white text-[10px]">✓</span>
      </div>
    </div>

    <div class="space-y-6">
      <div class="space-y-1.5">
        <h3 class="text-xl font-bold text-slate-900 font-display tracking-tight">
          {{ title }}
        </h3>
        <p class="text-sm text-slate-500 leading-relaxed max-w-lg font-medium">
          {{ description }}
        </p>
      </div>
      
      <div class="flex items-center gap-4 pt-4 border-t border-slate-50">
        <div class="space-y-0.5">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Target Amount
          </p>
          <p class="text-sm font-black text-slate-900 tracking-tight">
            {{ amount }}
          </p>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">


defineProps<{
  title: string
  description: string
  amount: string
  selected: boolean
}>()

defineEmits<{
  select: []
}>()
</script>
