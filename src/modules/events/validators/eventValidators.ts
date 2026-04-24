import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().trim().min(2, 'Event title is required'),
  description: z.string().trim().min(5, 'Description is required'),
  eventDate: z.string().nullable(),
})

export type CreateEventSchema = z.infer<typeof createEventSchema>
