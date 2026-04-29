import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { notificationTemplatesService, type CreateNotificationTemplatePayload, type UpdateNotificationTemplatePayload } from '../services/notificationTemplatesService'

export function useNotificationTemplates(params?: { templateKey?: string; channel?: string }) {
  return useQuery({
    queryKey: ['notification-templates', params],
    queryFn: () => notificationTemplatesService.list(params)
  })
}

export function useNotificationTemplate(id: string) {
  return useQuery({
    queryKey: ['notification-templates', id],
    queryFn: () => notificationTemplatesService.getById(id),
    enabled: !!id
  })
}

export function useCreateNotificationTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateNotificationTemplatePayload) => notificationTemplatesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] })
    }
  })
}

export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotificationTemplatePayload }) => 
      notificationTemplatesService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] })
      queryClient.invalidateQueries({ queryKey: ['notification-templates', variables.id] })
    }
  })
}
