<template>
  <div class="space-y-4">
    <label
      v-if="label"
      class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
    >
      {{ label }}
    </label>
    
    <div 
      class="relative group cursor-pointer border-2 border-dashed border-slate-200 transition-all duration-500 hover:border-slate-900 bg-slate-50/30"
      @click="isEditing = true"
    >
      <div class="aspect-video flex items-center justify-center overflow-hidden">
        <img 
          v-if="modelValue" 
          :src="modelValue" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          @error="handleError"
        >
        <div
          v-else
          class="flex flex-col items-center gap-3 text-slate-300"
        >
          <component
            :is="icon"
            class="w-10 h-10 stroke-[1.5]"
          />
          <p class="text-[10px] font-black uppercase tracking-widest">
            Click to set image URL
          </p>
        </div>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="px-6 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {{ modelValue ? 'Change Image' : 'Add Image' }}
        </div>
      </div>
    </div>

    <!-- URL Input Modal-like area (simplified) -->
    <div 
      v-if="isEditing" 
      class="animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div class="flex gap-2">
        <AppInput 
          :model-value="modelValue"
          placeholder="Paste high-res image URL here..."
          class="flex-1"
          @update:model-value="$emit('update:modelValue', $event)"
        />
        <AppButton 
          variant="primary" 
          size="sm" 
          class="shrink-0"
          @click="isEditing = false"
        >
          Apply
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Image as ImageIcon, Plus } from 'lucide-vue-next'
import AppInput from './AppInput.vue'
import AppButton from '../buttons/AppButton.vue'

interface Props {
  modelValue: string
  label?: string
  icon?: any
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  icon: ImageIcon
})

defineEmits(['update:modelValue'])

const isEditing = ref(false)

function handleError(e: Event) {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}
</script>
