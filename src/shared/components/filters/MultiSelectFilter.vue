<template>
  <div class="relative">
    <button
      type="button"
      class="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-violet-300 hover:text-violet-600 transition-all outline-none focus:ring-4 focus:ring-violet-500/10"
      @click="isOpen = !isOpen"
    >
      <Filter class="w-3.5 h-3.5" />
      {{ label }}: 
      <span class="text-slate-900">{{ selectedLabel }}</span>
      <ChevronDown 
        class="w-3 h-3 ml-1 transition-transform duration-300" 
        :class="{ 'rotate-180': isOpen }" 
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-none shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Filter Selection</span>
        <button 
          class="text-[9px] font-bold text-violet-600 hover:underline uppercase tracking-widest"
          @click="clearAll"
        >
          Clear
        </button>
      </div>
      
      <div class="max-h-[300px] overflow-y-auto p-2 space-y-1">
        <div
          v-for="option in options"
          :key="option.value"
          class="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors group"
          @click="toggleOption(option.value)"
        >
          <div 
            class="w-4 h-4 border-2 flex items-center justify-center transition-all"
            :class="isSelected(option.value) ? 'bg-violet-600 border-violet-600' : 'border-slate-200 bg-white group-hover:border-slate-300'"
          >
            <Check v-if="isSelected(option.value)" class="w-3 h-3 text-white" />
          </div>
          <span 
            class="text-[11px] font-black uppercase tracking-tight transition-colors"
            :class="isSelected(option.value) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'"
          >
            {{ option.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Filter, ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: any[]
  options: { label: string, value: any }[]
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
}>()

const isOpen = ref(false)

const selectedLabel = computed(() => {
  if (props.modelValue.length === 0) return 'All'
  if (props.modelValue.length === 1) {
    return props.options.find(o => o.value === props.modelValue[0])?.label || 'All'
  }
  return `${props.modelValue.length} Selected`
})

function isSelected(value: any) {
  return props.modelValue.includes(value)
}

function toggleOption(value: any) {
  const newList = [...props.modelValue]
  const index = newList.indexOf(value)
  if (index > -1) {
    newList.splice(index, 1)
  } else {
    newList.push(value)
  }
  emit('update:modelValue', newList)
}

function clearAll() {
  emit('update:modelValue', [])
}

// Close on click outside
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>
