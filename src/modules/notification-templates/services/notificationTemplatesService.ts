import { httpClient } from '@/core/api/httpClient'

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
    const response = await httpClient.get<NotificationTemplate[]>(BASE, { params })
    return response.data
  },

  async getById(id: string): Promise<NotificationTemplate> {
    const response = await httpClient.get<NotificationTemplate>(`${BASE}/${id}`)
    return response.data
  },

  async create(payload: CreateNotificationTemplatePayload): Promise<string> {
    const response = await httpClient.post<string, CreateNotificationTemplatePayload>(BASE, payload)
    return response.data
  },

  async update(id: string, payload: UpdateNotificationTemplatePayload): Promise<boolean> {
    const response = await httpClient.put<boolean, UpdateNotificationTemplatePayload>(`${BASE}/${id}`, payload)
    return response.data
  },

  async preview(id: string, variables: Record<string, string>): Promise<RenderedTemplate> {
    const response = await httpClient.post<RenderedTemplate, Record<string, string>>(
      `${BASE}/${id}/preview`,
      variables,
    )
    return response.data
  },

  async sendTest(id: string, recipient: string): Promise<void> {
    await httpClient.post<void, { recipient: string }>(`${BASE}/${id}/send-test`, { recipient })
  },
}
