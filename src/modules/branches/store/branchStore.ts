import { defineStore } from 'pinia'
import { ref } from 'vue'

const BRANCH_ID_KEY = 'mftl_selected_branch_id'
const BRANCH_NAME_KEY = 'mftl_selected_branch_name'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

function readStorage(key: string): string {
  return getStorage()?.getItem(key) ?? ''
}

export function readSelectedBranchId(): string {
  return readStorage(BRANCH_ID_KEY)
}

export const useBranchStore = defineStore('branch', () => {
  const selectedBranchId = ref(readSelectedBranchId())
  const selectedBranchName = ref(readStorage(BRANCH_NAME_KEY))

  function setBranch(id: string | null, name: string | null) {
    selectedBranchId.value = id ?? ''
    selectedBranchName.value = name ?? ''
    
    if (id) {
      getStorage()?.setItem(BRANCH_ID_KEY, id)
    } else {
      getStorage()?.removeItem(BRANCH_ID_KEY)
    }
    
    if (name) {
      getStorage()?.setItem(BRANCH_NAME_KEY, name)
    } else {
      getStorage()?.removeItem(BRANCH_NAME_KEY)
    }
  }

  function clearBranch() {
    setBranch(null, null)
  }

  return {
    selectedBranchId,
    selectedBranchName,
    setBranch,
    clearBranch
  }
})
