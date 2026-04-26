import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const BRANCH_ID_KEY = 'mftl_selected_branch_id'
const BRANCH_NAME_KEY = 'mftl_selected_branch_name'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

function readStorage(key: string): string {
  return getStorage()?.getItem(key) ?? ''
}

export function readSelectedBranchIds(): string[] {
  const stored = readStorage(BRANCH_ID_KEY)
  if (!stored) return []
  if (stored.startsWith('[')) {
    try {
      return JSON.parse(stored)
    } catch {
      return [stored]
    }
  }
  return stored ? [stored] : []
}

export const useBranchStore = defineStore('branch', () => {
  const selectedBranchIds = ref<string[]>(readSelectedBranchIds())
  
  // Legacy support
  const selectedBranchId = computed(() => selectedBranchIds.value[0] ?? '')
  const selectedBranchName = ref(readStorage(BRANCH_NAME_KEY))

  function setBranch(id: string | null, name: string | null) {
    if (id) {
      selectedBranchIds.value = [id]
      selectedBranchName.value = name ?? ''
      getStorage()?.setItem(BRANCH_ID_KEY, id)
      getStorage()?.setItem(BRANCH_NAME_KEY, name ?? '')
    } else {
      selectedBranchIds.value = []
      selectedBranchName.value = ''
      getStorage()?.removeItem(BRANCH_ID_KEY)
      getStorage()?.removeItem(BRANCH_NAME_KEY)
    }
  }

  function setBranches(ids: string[]) {
    selectedBranchIds.value = ids
    getStorage()?.setItem(BRANCH_ID_KEY, JSON.stringify(ids))
  }

  function toggleBranch(id: string) {
    const index = selectedBranchIds.value.indexOf(id)
    if (index > -1) {
      selectedBranchIds.value.splice(index, 1)
    } else {
      selectedBranchIds.value.push(id)
    }
    getStorage()?.setItem(BRANCH_ID_KEY, JSON.stringify(selectedBranchIds.value))
  }

  function clearBranch() {
    selectedBranchIds.value = []
    selectedBranchName.value = ''
    getStorage()?.removeItem(BRANCH_ID_KEY)
    getStorage()?.removeItem(BRANCH_NAME_KEY)
  }

  return {
    selectedBranchIds,
    selectedBranchId,
    selectedBranchName,
    setBranch,
    setBranches,
    toggleBranch,
    clearBranch
  }
})

export function readSelectedBranchId(): string {
  const ids = readSelectedBranchIds()
  return ids.join(',')
}
