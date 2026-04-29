import apiClient from '@/core/api/apiClient'

export interface NotificationTemplate {
  id: string
  tenantId: string
  branchId: string | null
  templateKey: string
  channel: 'Sms' | 'Email' | 'Push' | 'InApp' | 'WhatsApp'
  name: string
  subject: string | null
  body: string
  description: string | null
  isActive: boolean
  isSystemDefault: boolean
  createdAt: string
  modifiedAt: string | null
}

export interface CreateNotificationTemplatePayload {
  templateKey: string
  channel: NotificationTemplate['channel']
  name: string
  subject?: string | null
  body: string
  description?: string | null
  isActive?: boolean
}

export interface UpdateNotificationTemplatePayload {
  name: string
  subject?: string | null
  body: string
  description?: string | null
  isActive: boolean
}

export interface RenderedTemplate {
  subject: string | null
  body: string
}

const BASE = '/notification-templates'

export const notificationTemplatesService = {
  async list(params?: { templateKey?: string; channel?: string }): Promise<NotificationTemplate[]> {
    const { data } = await apiClient.get(BASE, { params })
    return data.data
  },

  async getById(id: string): Promise<NotificationTemplate> {
    const { data } = await apiClient.get(`${BASE}/${id}`)
    return data.data
  },

  async create(payload: CreateNotificationTemplatePayload): Promise<string> {
    const { data } = await apiClient.post(BASE, payload)
    return data.data
  },

  async update(id: string, payload: UpdateNotificationTemplatePayload): Promise<boolean> {
    const { data } = await apiClient.put(`${BASE}/${id}`, payload)
    return data.data
  },

  async preview(id: string, variables: Record<string, string>): Promise<RenderedTemplate> {
    const { data } = await apiClient.post(`${BASE}/${id}/preview`, variables)
    return data.data
  },

  async sendTest(id: string, recipient: string): Promise<void> {
    await apiClient.post(`${BASE}/${id}/send-test`, { recipient })
  },
}
