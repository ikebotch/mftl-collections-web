import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message: string) {
    add(message, 'success')
  }

  function error(message: string) {
    add(message, 'error', 6000)
  }

  function info(message: string) {
    add(message, 'info')
  }

  function warning(message: string) {
    add(message, 'warning')
  }

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info,
    warning,
  }
})
