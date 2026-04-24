import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventsStore = defineStore('events-module', () => {
  const selectedEventId = ref('')

  function setSelectedEvent(id: string) {
    selectedEventId.value = id
  }

  return {
    selectedEventId,
    setSelectedEvent,
  }
})
