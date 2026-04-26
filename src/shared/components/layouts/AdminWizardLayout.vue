<template>
  <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16 items-start">
    <!-- Left Sidebar: Section Navigation -->
    <aside class="sticky top-32 space-y-8 hidden lg:block">
      <div class="space-y-8">
        <h3 v-if="title" class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 italic">
          {{ title }}
        </h3>
        
        <nav class="relative px-2">
          <!-- Connecting Line -->
          <div class="absolute left-[31px] top-6 bottom-6 w-[1px] bg-slate-100 z-0" />
          
          <ul class="space-y-6 relative z-10">
            <li v-for="(section, index) in sections" :key="section.id">
              <button
                class="w-full flex items-center gap-6 p-2 rounded-none transition-all duration-500 group text-left"
                @click="scrollToSection(section.id)"
              >
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-500"
                  :class="activeSection === section.id 
                    ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20 scale-110' 
                    : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'"
                >
                  {{ index + 1 }}
                </div>
                <div class="min-w-0">
                  <p 
                    class="text-[11px] font-black tracking-widest uppercase transition-colors duration-500"
                    :class="activeSection === section.id ? 'text-violet-600' : 'text-slate-400'"
                  >
                    {{ section.title }}
                  </p>
                  <p class="text-[9px] font-bold text-slate-300 uppercase tracking-widest truncate">
                    {{ section.subtitle || `Step ${(index + 1).toString().padStart(2, '0')}` }}
                  </p>
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <slot name="sidebar-footer" />
    </aside>

    <!-- Right Column: Content -->
    <div class="flex flex-col gap-16">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Section {
  id: string
  title: string
  subtitle?: string
}

const props = withDefaults(defineProps<{
  sections: Section[]
  title?: string
  offset?: number
}>(), {
  title: 'Sections',
  offset: 120
})

const activeSection = ref(props.sections[0]?.id || '')
let observer: IntersectionObserver | null = null

const initObserver = () => {
  if (observer) observer.disconnect()
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        activeSection.value = entry.target.id
      }
    })
  }, { 
    threshold: [0.3], 
    rootMargin: `-${props.offset}px 0px -50% 0px` 
  })

  props.sections.forEach(section => {
    const el = document.getElementById(section.id)
    if (el) observer?.observe(el)
  })
}

onMounted(() => {
  initObserver()
})

watch(() => props.sections, () => {
  setTimeout(initObserver, 100)
}, { deep: true })

onUnmounted(() => {
  observer?.disconnect()
})

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

defineExpose({
  activeSection,
  scrollToSection
})
</script>
