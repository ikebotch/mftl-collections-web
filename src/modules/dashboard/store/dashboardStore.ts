import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard-module', () => {
  const lastVisitedSection = ref('overview')

  return {
    lastVisitedSection,
  }
})
