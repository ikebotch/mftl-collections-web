<template>
  <AppModal
    title="Deploy Staff"
    @close="$emit('close')"
  >
    <div class="space-y-8">
      <div class="space-y-2">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          Select Field Agents
        </p>
        <div class="divide-y divide-slate-100 border border-slate-200 bg-white">
          <div 
            v-for="collector in availableStaff" 
            :key="collector.id"
            class="group flex items-center justify-between p-5 hover:bg-slate-50 transition-all cursor-pointer"
            @click="toggleSelection(collector.id)"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-5 h-5 border-2 flex items-center justify-center transition-all duration-300"
                :class="selectedIds.includes(collector.id) ? 'bg-violet-600 border-violet-600' : 'bg-white border-slate-200'"
              >
                <Check
                  v-if="selectedIds.includes(collector.id)"
                  class="w-3.5 h-3.5 text-white"
                />
              </div>
              <div>
                <p class="text-xs font-black text-slate-900 uppercase tracking-tight">
                  {{ collector.name }}
                </p>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {{ collector.email }}
                </p>
              </div>
            </div>
          </div>
          
          <div
            v-if="availableStaff.length === 0"
            class="p-12 text-center"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              All active staff members are already deployed to this stream.
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 justify-end pt-4 border-t border-slate-100">
        <AppButton 
          variant="secondary" 
          @click="$emit('close')"
        >
          Cancel
        </AppButton>
        <AppButton 
          variant="primary" 
          :loading="loading"
          :disabled="selectedIds.length === 0"
          @click="handleAssign"
        >
          Deploy {{ selectedIds.length }} Agent{{ selectedIds.length !== 1 ? 's' : '' }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Check } from 'lucide-vue-next'
import AppModal from '@/shared/components/modals/AppModal.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import { collectorService } from '@/modules/collector/services/collectorService'
import { eventService } from '@/modules/events/services/eventService'
import { useToastStore } from '@/shared/stores/useToastStore'
import type { CollectorProfile } from '@/modules/collector/types/collector'

const props = defineProps<{
  eventId: string
}>()

const emit = defineEmits(['close', 'deployed'])
const toast = useToastStore()

const staff = ref<CollectorProfile[]>([])
const selectedIds = ref<string[]>([])
const loading = ref(false)

const availableStaff = computed(() => {
  // In a real app, the API would filter staff not already assigned to this event
  return staff.value
})

onMounted(async () => {
  try {
    // Get all collectors to allow selection
    staff.value = await collectorService.listAll()
  } catch (err) {
    console.error('Failed to load staff:', err)
  }
})

function toggleSelection(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

async function handleAssign() {
  loading.value = true
  try {
    await eventService.assignStaff(props.eventId, selectedIds.value)
    toast.success('Staff deployed successfully to the stream')
    emit('deployed')
  } catch (err) {
    console.error('Failed to assign staff:', err)
    toast.error('Assignment failed. Please check network logs.')
  } finally {
    loading.value = false
  }
}
</script>
