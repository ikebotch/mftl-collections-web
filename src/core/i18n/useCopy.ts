import { reactive, computed } from 'vue'
import en from './en.json'
import fr from './fr.json'
import es from './es.json'

// Standard lightweight content provider
const state = reactive({
  locale: 'en',
  dictionaries: {
    en,
    fr,
    es
  }
})

export function useCopy() {
  const copy = computed(() => {
    // @ts-ignore - dynamic dictionary access
    return state.dictionaries[state.locale] || state.dictionaries.en
  })

  function setLocale(newLocale: string) {
    state.locale = newLocale
    localStorage.setItem('mftl_locale', newLocale)
  }

  // Initialize from storage if available
  const stored = localStorage.getItem('mftl_locale')
  if (stored && ['en', 'fr', 'es'].includes(stored)) {
    state.locale = stored
  }

  return {
    copy,
    setLocale,
    currentLocale: computed(() => state.locale),
    availableLocales: ['en', 'fr', 'es']
  }
}
