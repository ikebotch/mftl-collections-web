<template>
  <div class="flow-root">
    <ul
      role="list"
      class="-mb-8"
    >
      <li
        v-for="(event, eventIdx) in events"
        :key="event.id"
      >
        <div class="relative pb-8">
          <span
            v-if="eventIdx !== events.length - 1"
            class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-100"
            aria-hidden="true"
          />
          <div class="relative flex space-x-3">
            <div>
              <span 
                class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                :class="getEventColorClass(event.type)"
              >
                <component
                  :is="getEventIcon(event.type)"
                  class="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-slate-500 font-medium">
                  {{ event.content }} <span class="font-bold text-slate-900">{{ event.target }}</span>
                </p>
                <p
                  v-if="event.description"
                  class="mt-1 text-xs text-slate-400"
                >
                  {{ event.description }}
                </p>
              </div>
              <div class="whitespace-nowrap text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <time :datetime="event.datetime">{{ event.date }}</time>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { 
  Check, 
  User, 
  Tag, 
  MessageSquare, 
  Calendar, 
  DollarSign,
  AlertCircle
} from 'lucide-vue-next'

interface AuditEvent {
  id: string | number
  type: 'creation' | 'update' | 'payment' | 'assignment' | 'comment' | 'alert'
  content: string
  target?: string
  description?: string
  date: string
  datetime: string
}

defineProps<{
  events: AuditEvent[]
}>()

function getEventIcon(type: string) {
  switch (type) {
    case 'creation': return Calendar
    case 'update': return Tag
    case 'payment': return DollarSign
    case 'assignment': return User
    case 'comment': return MessageSquare
    case 'alert': return AlertCircle
    default: return Check
  }
}

function getEventColorClass(type: string) {
  switch (type) {
    case 'creation': return 'bg-blue-500'
    case 'update': return 'bg-violet-500'
    case 'payment': return 'bg-emerald-500'
    case 'assignment': return 'bg-amber-500'
    case 'comment': return 'bg-slate-500'
    case 'alert': return 'bg-rose-500'
    default: return 'bg-slate-400'
  }
}
</script>
