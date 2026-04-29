<template>
  <DetailDrawer
    :is-open="isOpen"
    title="Render Preview"
    :subtitle="template?.name"
    @close="$emit('close')"
  >
    <div class="space-y-10">
      <!-- Variable Input -->
      <AppCard class="!p-8 space-y-6 border-slate-200">
        <EditorialHeader title="Test Variables" />
        <div class="space-y-4">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Provide sample JSON data to see how the template renders with real values.
          </p>
          <textarea
            v-model="variablesJson"
            class="w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-none p-4 text-[11px] font-mono font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
            placeholder="{ &quot;donorName&quot;: &quot;Ama Mensah&quot;, ... }"
          />
          <AppButton
            variant="outline"
            class="w-full"
            :loading="loading"
            @click="fetchPreview"
          >
            Update Preview
          </AppButton>
        </div>
      </AppCard>

      <!-- Preview Output -->
      <div
        v-if="rendered"
        class="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700"
      >
        <AppCard
          v-if="rendered.subject"
          class="!p-8 border-slate-200 bg-slate-50/50"
        >
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">
            Subject Line
          </p>
          <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
            {{ rendered.subject }}
          </p>
        </AppCard>

        <AppCard class="!p-8 border-slate-200">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">
            Message Body
          </p>
          <div class="prose prose-slate prose-sm max-w-none whitespace-pre-wrap font-medium text-slate-700 leading-relaxed">
            {{ rendered.body }}
          </div>
        </AppCard>
      </div>

      <div
        v-else-if="loading"
        class="py-20 flex flex-col items-center justify-center gap-4"
      >
        <div class="w-10 h-10 border-4 border-slate-100 border-t-violet-600 animate-spin" />
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Rendering Environment...
        </p>
      </div>
    </div>
  </DetailDrawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import EditorialHeader from '@/shared/components/headers/EditorialHeader.vue'
import { notificationTemplatesService, type NotificationTemplate, type RenderedTemplate } from '../services/notificationTemplatesService'
import { useToastStore } from '@/shared/stores/useToastStore'

const props = defineProps<{
  isOpen: boolean
  template: NotificationTemplate | null
}>()

const emit = defineEmits(['close'])
const toast = useToastStore()

const loading = ref(false)
const rendered = ref<RenderedTemplate | null>(null)
const variablesJson = ref(JSON.stringify({
  donorName: "Ama Mensah",
  receiptNumber: "RCT-000123",
  amount: "250.00",
  currency: "GHS",
  eventName: "Main Event",
  receiptLink: "https://example.com/receipt/RCT-000123"
}, null, 2))

watch(() => props.isOpen, (open) => {
  if (open) {
    fetchPreview()
  } else {
    rendered.value = null
  }
})

async function fetchPreview() {
  if (!props.template) return
  
  try {
    loading.value = true
    const vars = JSON.parse(variablesJson.value)
    rendered.value = await notificationTemplatesService.preview(props.template.id, vars)
  } catch (err: any) {
    toast.error('Failed to render preview. Check your JSON format.')
  } finally {
    loading.value = false
  }
}
</script>
