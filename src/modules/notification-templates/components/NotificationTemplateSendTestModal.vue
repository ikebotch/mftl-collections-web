<template>
  <AppModal
    :open="isOpen"
    title="Send Strategic Test"
    @close="$emit('close')"
  >
    <div class="space-y-8 p-1">
      <p class="text-sm font-medium text-slate-600 leading-relaxed">
        Send a test notification to a specific recipient to verify the final delivery across the <span class="font-black text-slate-900 uppercase tracking-tight">{{ template?.channel }}</span> channel.
      </p>

      <div class="space-y-6">
        <AppInput
          v-model="recipient"
          :label="template?.channel === 'Email' ? 'Recipient Email' : 'Recipient Phone'"
          :placeholder="template?.channel === 'Email' ? 'you@example.com' : '+233...'"
          required
        />

        <div class="space-y-3">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Override Variables (Optional JSON)
          </label>
          <textarea
            v-model="variablesJson"
            class="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-none p-4 text-[11px] font-mono font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
            placeholder="{ &quot;donorName&quot;: &quot;Test User&quot; }"
          />
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <AppButton
          variant="outline"
          class="flex-1"
          @click="$emit('close')"
        >
          Cancel
        </AppButton>
        <AppButton
          variant="primary"
          class="flex-1"
          :loading="sending"
          :disabled="!recipient"
          @click="handleSend"
        >
          Dispatch Test
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/shared/components/modals/AppModal.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import type { NotificationTemplate } from '../services/notificationTemplatesService'
import { notificationTemplatesService } from '../services/notificationTemplatesService'
import { useToastStore } from '@/shared/stores/useToastStore'

const props = defineProps<{
  isOpen: boolean
  template: NotificationTemplate | null
}>()

const emit = defineEmits(['close', 'sent'])
const toast = useToastStore()

const recipient = ref('')
const variablesJson = ref('{}')
const sending = ref(false)

watch(() => props.isOpen, (open) => {
  if (open) {
    recipient.value = ''
    variablesJson.value = '{}'
  }
})

async function handleSend() {
  if (!props.template) return
  
  try {
    sending.value = true
    // Note: The current service only takes recipient, but we might want to extend it for variables
    // For now we follow the existing service signature
    await notificationTemplatesService.sendTest(props.template.id, recipient.value)
    toast.success(`Test notification dispatched via ${props.template.channel}.`)
    emit('sent')
    emit('close')
  } catch (err: any) {
    toast.error(err.message || 'Failed to dispatch test notification.')
  } finally {
    sending.value = false
  }
}
</script>
