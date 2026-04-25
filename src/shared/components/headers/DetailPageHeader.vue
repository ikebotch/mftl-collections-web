<template>
  <div class="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
    <!-- Breadcrumb -->
    <button
      v-if="backTo"
      type="button"
      class="group mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-violet-600 transition-all"
      @click="handleBack"
    >
      <ArrowLeft class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
      Back to {{ backLabel || 'list' }}
    </button>

    <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div class="flex items-start gap-5">
        <!-- Optional Image/Icon Prefix -->
        <div 
          v-if="imageUrl || $slots.prefix"
          class="w-14 h-14 shrink-0 rounded-none bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm"
        >
          <img 
            v-if="imageUrl" 
            :src="imageUrl" 
            class="w-full h-full object-cover"
          />
          <slot v-else name="prefix" />
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-4">
            <h1 class="text-3xl font-black tracking-tighter text-slate-900 leading-none">
              {{ title }}
            </h1>
            <slot name="status" />
          </div>
          <p
            v-if="description"
            class="text-xs font-medium text-slate-500 max-w-2xl leading-relaxed uppercase tracking-widest opacity-80"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <div
        v-if="$slots.actions"
        class="flex flex-wrap items-center gap-3 pt-1"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  description?: string
  backTo?: string | object
  backLabel?: string
  imageUrl?: string
}>()

const router = useRouter()

function handleBack() {
  if (typeof props.backTo === 'string') {
    router.push(props.backTo)
  } else if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>
