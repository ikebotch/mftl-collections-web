import { z } from 'zod'

export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  eventDate: z.string().nullable().optional(),
  isActive: z.boolean(),
})

export type Event = z.infer<typeof EventSchema>

export const CreateEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  eventDate: z.string().nullable().optional(),
})

export type CreateEventRequest = z.infer<typeof CreateEventSchema>
