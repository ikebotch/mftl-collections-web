<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Collector"
      title="Assigned events"
      description="Tap through to move quickly into contribution capture."
    />
    <div class="space-y-4">
      <div 
        v-if="query.isLoading.value" 
        class="text-center py-12 text-slate-400 font-medium animate-pulse"
      >
        Loading assigned events...
      </div>
      <div 
        v-else-if="!query.data.value?.length" 
        class="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200"
      >
        <p class="text-slate-500 font-medium">
          No events assigned to you today.
        </p>
      </div>
      <div 
        v-for="event in query.data.value" 
        :key="event.id"
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 group hover:border-violet-200 transition-all"
      >
        <div class="min-w-0">
          <h3 class="font-bold text-slate-900 truncate">
            {{ event.title }}
          </h3>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ event.date }}</span>
            <span class="w-1 h-1 rounded-full bg-slate-200" />
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ event.location }}</span>
          </div>
        </div>
        <AppButton
          size="sm"
          class="shrink-0"
          @click="router.push(`/collector/contributions/new?eventId=${event.id}`)"
        >
          Collect
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAssignedEvents } from '../composables/useCollector'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
const router = useRouter()
const query = useAssignedEvents()
</script>
