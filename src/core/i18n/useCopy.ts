import { reactive, computed } from 'vue'
import en from './en.json'

// Standard lightweight content provider
const state = reactive({
  locale: 'en',
  dictionaries: {
    en
  }
})

export function useCopy() {
  const copy = computed(() => {
    // @ts-ignore - dynamic dictionary access
    return state.dictionaries[state.locale] || state.dictionaries.en
  })

  // Helper to change locale if needed later
  function setLocale(newLocale: string) {
    state.locale = newLocale
  }

  return {
    copy,
    setLocale,
    currentLocale: computed(() => state.locale)
  }
}
