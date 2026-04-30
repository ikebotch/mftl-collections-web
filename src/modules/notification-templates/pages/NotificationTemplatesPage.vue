<template>
  <div class="space-y-10 pb-20">
    <AdminPageHeader
      title="Notification Templates"
      description="Manage multi-channel strategic communication templates with dynamic variables and hierarchical overrides."
    >
      <template #actions>
        <AppButton
          variant="primary"
          class="shadow-premium px-8"
          @click="openCreateForm"
        >
          <Plus class="w-4 h-4 mr-2" />
          New Template
        </AppButton>
      </template>
    </AdminPageHeader>

    <div class="space-y-6">
      <AdminFilterBar
        v-model="searchQuery"
        placeholder="Search by name or key..."
        :show-clear="!!(searchQuery || activeChannel !== 'all' || activeScope !== 'all')"
        @clear="clearFilters"
      >
        <template #sections>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Communication Channel</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="ch in ['all', 'Sms', 'Email', 'Push', 'InApp']"
                :key="ch"
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all"
                :class="activeChannel === ch ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-100' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'"
                @click="activeChannel = ch"
              >
                {{ ch === 'all' ? 'All Channels' : ch }}
              </button>
            </div>
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Resolution Scope</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="sc in ['all', 'System', 'Tenant', 'Branch']"
                :key="sc"
                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full"
                :class="activeScope === sc ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-100' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'"
                @click="activeScope = sc"
              >
                {{ sc }}
              </button>
            </div>
          </div>
        </template>
      </AdminFilterBar>

      <DataTable
        :columns="columns"
        :rows="filteredTemplates"
        :loading="query.isLoading.value"
        title="Template Catalog"
      >
        <template #cell:name="{ row }">
          <div class="flex flex-col">
            <span class="text-sm font-black text-slate-900 uppercase tracking-tight">{{ row.name }}</span>
            <span
              class="text-[10px] font-mono text-slate-400 mt-1 italic"
              v-text="'{{' + row.templateKey + '}}'"
            ></span>
          </div>
        </template>

        <template #cell:channel="{ value }">
          <div class="flex items-center gap-2">
            <component
              :is="getChannelIcon(value)"
              class="w-3.5 h-3.5 text-slate-400"
            />
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">{{ value }}</span>
          </div>
        </template>

        <template #cell:scope="{ row }">
          <span 
            class="px-2 py-1 text-[9px] font-black uppercase tracking-widest border"
            :class="getScopeClass(row)"
          >
            {{ getScopeLabel(row) }}
          </span>
        </template>

        <template #cell:status="{ value }">
          <StatusBadge
            :status="value ? 'Active' : 'Inactive'"
            :tone="value ? 'success' : 'neutral'"
          />
        </template>

        <template #cell:modifiedAt="{ value }">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {{ value ? new Date(value).toLocaleDateString() : 'Never' }}
          </span>
        </template>

        <template #rowActions="{ row }">
          <RowActions
            :actions="[
              { label: 'Edit Template', icon: 'Edit3', onClick: () => openEditForm(row), show: canManage },
              { label: 'View Configuration', icon: 'Eye', onClick: () => openEditForm(row), show: !canManage },
              { label: 'Preview Render', icon: 'Layout', onClick: () => openPreview(row) },
              { label: 'Dispatch Test', icon: 'Send', onClick: () => openSendTest(row), show: canManage }
            ].filter(a => a.show !== false)"
          />
        </template>
      </DataTable>
    </div>

    <!-- Components -->
    <NotificationTemplateForm
      :is-open="isFormOpen"
      :initial-data="selectedTemplate"
      :can-manage="canManage"
      @close="isFormOpen = false"
      @save="handleSave"
    />

    <NotificationTemplatePreview
      :is-open="isPreviewOpen"
      :template="selectedTemplate"
      @close="isPreviewOpen = false"
    />

    <NotificationTemplateSendTestModal
      :is-open="isSendTestOpen"
      :template="selectedTemplate"
      @close="isSendTestOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationTemplates, useCreateNotificationTemplate, useUpdateNotificationTemplate } from '../composables/useNotificationTemplates'
import { useUsersStore } from '@/modules/users/store/usersStore'
import { Permissions } from '@/core/auth/permissions'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AdminFilterBar from '@/shared/components/filters/AdminFilterBar.vue'
import DataTable from '@/shared/components/tables/DataTable.vue'
import StatusBadge from '@/shared/components/badges/StatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import RowActions from '@/shared/components/tables/RowActions.vue'
import NotificationTemplateForm from '../components/NotificationTemplateForm.vue'
import NotificationTemplatePreview from '../components/NotificationTemplatePreview.vue'
import NotificationTemplateSendTestModal from '../components/NotificationTemplateSendTestModal.vue'
import { 
  Plus, 
  MessageSquare, 
  Mail, 
  Bell, 
  Smartphone, 
  MessageCircle 
} from 'lucide-vue-next'
import type { NotificationTemplate } from '../services/notificationTemplatesService'

const usersStore = useUsersStore()
const toast = useToastStore()
const canManage = computed(() => 
  usersStore.isPlatformAdmin || 
  usersStore.hasPermission(Permissions.NotificationTemplates.Update) || 
  usersStore.hasPermission(Permissions.NotificationTemplates.Create)
)

const searchQuery = ref('')
const activeChannel = ref('all')
const activeScope = ref('all')

const query = useNotificationTemplates()
const createMutation = useCreateNotificationTemplate()
const updateMutation = useUpdateNotificationTemplate()

const templates = computed(() => query.data.value || [])

const columns = [
  { key: 'name', label: 'Template Name', sortable: true },
  { key: 'channel', label: 'Channel', sortable: true },
  { key: 'scope', label: 'Scope', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'modifiedAt', label: 'Last Modified', sortable: true }
]

const filteredTemplates = computed(() => {
  let items = templates.value
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.templateKey.toLowerCase().includes(q)
    )
  }

  if (activeChannel.value !== 'all') {
    items = items.filter(t => t.channel === activeChannel.value)
  }

  if (activeScope.value !== 'all') {
    items = items.filter(t => {
      const scope = getScopeLabel(t)
      return scope === activeScope.value
    })
  }

  return items
})

const isFormOpen = ref(false)
const isPreviewOpen = ref(false)
const isSendTestOpen = ref(false)
const selectedTemplate = ref<NotificationTemplate | null>(null)

function openCreateForm() {
  selectedTemplate.value = null
  isFormOpen.value = true
}

function openEditForm(item: NotificationTemplate) {
  selectedTemplate.value = item
  isFormOpen.value = true
}

function openPreview(item: NotificationTemplate) {
  selectedTemplate.value = item
  isPreviewOpen.value = true
}

function openSendTest(item: NotificationTemplate) {
  selectedTemplate.value = item
  isSendTestOpen.value = true
}

function clearFilters() {
  searchQuery.value = ''
  activeChannel.value = 'all'
  activeScope.value = 'all'
}

function getChannelIcon(channel: string) {
  switch (channel) {
    case 'Sms': return MessageSquare
    case 'Email': return Mail
    case 'Push': return Bell
    case 'InApp': return Smartphone
    case 'WhatsApp': return MessageCircle
    default: return MessageSquare
  }
}

function getScopeLabel(t: NotificationTemplate) {
  if (t.isSystemDefault) return 'System'
  if (t.branchId) return 'Branch'
  return 'Tenant'
}

function getScopeClass(t: NotificationTemplate) {
  if (t.isSystemDefault) return 'bg-slate-900 text-white border-slate-900'
  if (t.branchId) return 'bg-amber-50 text-amber-600 border-amber-200'
  return 'bg-violet-50 text-violet-600 border-violet-200'
}

async function handleSave(payload: any) {
  try {
    if (selectedTemplate.value) {
      await updateMutation.mutateAsync({
        id: selectedTemplate.value.id,
        payload
      })
      toast.success('Template updated successfully.')
    } else {
      await createMutation.mutateAsync(payload)
      toast.success('Template created successfully.')
    }
    isFormOpen.value = false
  } catch (err: any) {
    toast.error(err.message || 'Failed to save template.')
  }
}
</script>
