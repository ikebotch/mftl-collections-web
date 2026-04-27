import { ref, computed, type Ref } from 'vue'

interface ResourceListOptions<T> {
  sortKey: string
  sortOrder: 'asc' | 'desc'
  searchFields: (item: T) => (string | null | undefined)[]
  filter?: (item: T) => boolean
  customSort?: (a: T, b: T, key: string) => number
}

export function useResourceList<T>(items: Ref<T[]>, options: ResourceListOptions<T>) {
  const searchQuery = ref('')
  const sortKey = ref(options.sortKey)
  const sortOrder = ref(options.sortOrder)

  const filteredItems = computed(() => {
    let list = [...items.value]

    if (searchQuery.value) {
      const s = searchQuery.value.toLowerCase()
      list = list.filter((item) =>
        options.searchFields(item).some((field) => field?.toLowerCase().includes(s))
      )
    }

    if (options.filter) {
      list = list.filter(options.filter)
    }

    return list
  })

  const sortedItems = computed(() => {
    const list = [...filteredItems.value]
    const key = sortKey.value
    const order = sortOrder.value

    list.sort((a: any, b: any) => {
      if (options.customSort) {
        const customResult = options.customSort(a, b, key)
        if (customResult !== 0) return order === 'asc' ? customResult : -customResult
      }

      const valA = a[key]
      const valB = b[key]

      if (valA === valB) return 0
      if (valA == null) return 1
      if (valB == null) return -1

      if (typeof valA === 'string' && typeof valB === 'string') {
        return order === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA)
      }

      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })

    return list
  })

  function handleSort(key: string) {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
  }

  return {
    searchQuery,
    sortKey,
    sortOrder,
    filteredItems,
    sortedItems,
    handleSort
  }
}
