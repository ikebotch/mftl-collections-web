<template>
  <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
    <!-- Left Sidebar: Navigation -->
    <aside class="sticky top-28 space-y-8 hidden lg:block">
      <div class="space-y-6">
        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
          {{ title }}
        </h3>
        
        <nav class="relative">
          <!-- Connecting Line -->
          <div class="absolute left-[19px] top-4 bottom-4 w-[1px] bg-slate-100 z-0" />
          
          <ul class="space-y-4 relative z-10">
            <li 
              v-for="(section, index) in sections" 
              :key="section.id"
            >
              <button
                class="w-full flex items-center gap-4 p-2 rounded-none transition-all duration-300 group text-left"
                :class="activeSection === section.id ? '' : 'hover:bg-slate-50/50'"
                @click="scrollToSection(section.id)"
              >
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300"
                  :class="activeSection === section.id 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'"
                >
                  {{ index + 1 }}
                </div>
                <div class="min-w-0">
                  <p 
                    class="text-xs font-black tracking-tight transition-colors duration-300"
                    :class="activeSection === section.id ? 'text-violet-600' : 'text-slate-400'"
                  >
                    {{ section.title }}
                  </p>
                  <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest truncate">
                    {{ section.subtitle }}
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
    <div class="flex flex-col gap-12">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Section {
  id: string
  title: string
  subtitle: string
}

const props = withDefaults(defineProps<{
  sections: Section[]
  title?: string
  offset?: number
}>(), {
  title: 'Sections',
  offset: 80
})

const activeSection = ref(props.sections[0]?.id || '')
let observer: IntersectionObserver | null = null

onMounted(() => {
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
})

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
