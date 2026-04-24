import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCollectorStore = defineStore('collector-module', () => {
  const offlineModeEnabled = ref(false)

  return {
    offlineModeEnabled,
  }
})
