<template>
  <DetailDrawer
    :is-open="isOpen"
    :title="isEdit ? 'Edit Template' : 'New Template'"
    :subtitle="isEdit ? `Key: ${initialData?.templateKey}` : 'Strategic Communication'"
    @close="$emit('close')"
  >
    <form
      class="space-y-10"
      @submit.prevent="handleSubmit"
    >
      <AppCard class="!p-8 space-y-8 border-slate-200">
        <div class="grid grid-cols-1 gap-8">
          <AppInput
            v-model="form.name"
            label="Template Name"
            placeholder="e.g. Receipt Issued Notification"
            required
            :disabled="!canManage"
          />

          <div class="grid grid-cols-2 gap-8">
            <AppInput
              v-model="form.templateKey"
              label="Template Key"
              placeholder="e.g. receipt.issued"
              required
              :disabled="isEdit || !canManage"
            />

            <AppSelect
              v-model="form.channel"
              label="Channel"
              :options="channelOptions"
              required
              :disabled="isEdit || !canManage"
            />
          </div>

          <AppInput
            v-if="form.channel === 'Email'"
            v-model="form.subject"
            label="Subject"
            placeholder="e.g. Your receipt from {{eventName}}"
            required
            :disabled="!canManage"
          />

          <div class="space-y-4">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Template Body
            </label>
            <textarea
              v-model="form.body"
              class="w-full min-h-[200px] bg-slate-50 border border-slate-200 rounded-none p-4 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
              placeholder="Enter template body with {{placeholders}}..."
              required
              :disabled="!canManage"
            />
            <div class="p-4 bg-violet-50/50 border border-violet-100/50">
              <p class="text-[9px] font-black text-violet-600 uppercase tracking-widest mb-3">
                Available Variables
              </p>
              <div class="flex flex-wrap gap-2">
                <code 
                  v-for="v in variables" 
                  :key="v"
                  class="px-2 py-1 bg-white border border-violet-100 text-[10px] font-mono text-violet-600 cursor-pointer hover:bg-violet-600 hover:text-white transition-colors"
                  @click="insertVariable(v)"
                  v-text="'{{' + v + '}}'"
                >
                </code>
              </div>
            </div>
          </div>

          <AppInput
            v-model="form.description"
            label="Internal Description"
            placeholder="What is this template for?"
            :disabled="!canManage"
          />

          <ToggleCard
            v-model="form.isActive"
            title="Active Status"
            description="Enable or disable this template for live dispatch."
            :disabled="!canManage"
          />
        </div>
      </AppCard>
    </form>

    <template #actions>
      <AppButton
        variant="outline"
        class="flex-1"
        @click="$emit('close')"
      >
        Cancel
      </AppButton>
      <AppButton
        v-if="canManage"
        variant="primary"
        class="flex-1"
        :loading="submitting"
        @click="handleSubmit"
      >
        {{ isEdit ? 'Save Changes' : 'Create Template' }}
      </AppButton>
    </template>
  </DetailDrawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import DetailDrawer from '@/shared/components/drawers/DetailDrawer.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ToggleCard from '@/shared/components/cards/ToggleCard.vue'
import type { NotificationTemplate, CreateNotificationTemplatePayload, UpdateNotificationTemplatePayload } from '../services/notificationTemplatesService'

const props = defineProps<{
  isOpen: boolean
  initialData?: NotificationTemplate | null
  canManage: boolean
}>()

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.initialData)
const submitting = ref(false)

const form = ref<CreateNotificationTemplatePayload>({
  templateKey: '',
  channel: 'Sms',
  name: '',
  subject: '',
  body: '',
  description: '',
  isActive: true
})

const channelOptions = [
  { label: 'SMS', value: 'Sms' },
  { label: 'Email', value: 'Email' },
  { label: 'Push', value: 'Push' },
  { label: 'In-App', value: 'InApp' },
  { label: 'WhatsApp', value: 'WhatsApp' }
]

const variables = [
  'donorName', 'receiptNumber', 'amount', 'currency', 'eventName', 
  'collectorName', 'role', 'inviteLink', 'settlementId', 'receiptLink',
  'tenantName', 'fundName'
]

watch(() => props.isOpen, (open) => {
  if (open) {
    if (props.initialData) {
      form.value = {
        templateKey: props.initialData.templateKey,
        channel: props.initialData.channel,
        name: props.initialData.name,
        subject: props.initialData.subject || '',
        body: props.initialData.body,
        description: props.initialData.description || '',
        isActive: props.initialData.isActive
      }
    } else {
      form.value = {
        templateKey: '',
        channel: 'Sms',
        name: '',
        subject: '',
        body: '',
        description: '',
        isActive: true
      }
    }
  }
})

function insertVariable(variable: string) {
  if (!props.canManage) return
  const placeholder = `{{${variable}}}`
  form.value.body += placeholder
}

async function handleSubmit() {
  if (!props.canManage) return
  submitting.value = true
  try {
    emit('save', form.value)
  } finally {
    submitting.value = false
  }
}
</script>
