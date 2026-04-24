import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipientFundsStore = defineStore('recipient-funds-module', () => {
  const activeRecipientFundId = ref('')

  function setActiveRecipientFund(id: string) {
    activeRecipientFundId.value = id
  }

  return {
    activeRecipientFundId,
    setActiveRecipientFund,
  }
})
