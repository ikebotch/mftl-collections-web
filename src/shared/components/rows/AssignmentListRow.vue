<template>
  <div 
    class="flex items-center justify-between py-4 px-5 border-slate-100 bg-white hover:border-violet-200 transition-all group border-b last:border-b-0"
    :class="{ 
      'bg-slate-50/30': isHeader,
      'pl-14 !border-l-4 !border-l-violet-100 bg-slate-50/10': isSubItem
    }"
  >
    <div class="flex items-center gap-4">
      <div 
        class="w-10 h-10 flex items-center justify-center rounded-none bg-slate-50 border border-slate-100 shrink-0 overflow-hidden"
        :class="{ 
          '!bg-violet-50 !border-violet-100': isAssigned,
          'w-8 h-8': isSubItem
        }"
      >
        <img 
          v-if="imageUrl" 
          :src="imageUrl" 
          class="w-full h-full object-cover"
        >
        <component 
          :is="icon"
          v-else 
          class="w-4 h-4" 
          :class="[
            isAssigned ? 'text-violet-600' : 'text-slate-400',
            isSubItem ? 'w-3.5 h-3.5' : 'w-4 h-4'
          ]"
        />
      </div>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span 
            class="font-black text-slate-900 uppercase tracking-tight"
            :class="isSubItem ? 'text-[11px]' : 'text-xs'"
          >
            {{ title }}
          </span>
          <span 
            v-if="badge" 
            class="text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest rounded transition-colors"
            :class="{
              'bg-emerald-100 text-emerald-700': badge === 'Full Campaign',
              'bg-amber-100 text-amber-700': badge === 'Partial Scope',
              'bg-slate-100 text-slate-500': badge !== 'Full Campaign' && badge !== 'Partial Scope'
            }"
          >
            {{ badge }}
          </span>
        </div>
        <p
          v-if="subtitle"
          class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button
        v-if="showAction"
        type="button"
        class="flex items-center gap-2 transition-all"
        :class="isAssigned ? 'text-rose-500 hover:text-rose-600' : 'text-violet-600 hover:text-violet-700'"
        @click="$emit('action')"
      >
        <component
          :is="actionIcon"
          class="w-4 h-4"
        />
        <span class="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline">
          {{ actionLabel }}
        </span>
      </button>
      <div
        v-else-if="isAssigned && !isEditing"
        class="flex items-center gap-2 text-emerald-500"
      >
        <Check class="w-4 h-4" />
        <span class="text-[9px] font-black uppercase tracking-widest">Active Scope</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Calendar, 
  Target, 
  Plus, 
  X, 
  Check,
  type LucideIcon 
} from 'lucide-vue-next'

const props = defineProps<{
  type: 'event' | 'fund'
  title: string
  subtitle?: string
  badge?: string
  isAssigned?: boolean
  isEditing?: boolean
  isHeader?: boolean
  isSubItem?: boolean
  imageUrl?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()

const icon = computed(() => props.type === 'event' ? Calendar : Target)

const showAction = computed(() => props.isEditing)

const actionIcon = computed(() => props.isAssigned ? X : Plus)

const actionLabel = computed(() => props.isAssigned ? 'Remove' : 'Add Scope')
</script>
