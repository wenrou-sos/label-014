import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Waybill, FilterType } from '@/types'
import { fetchWaybills } from '@/mock/waybills'

export const useWaybillStore = defineStore('waybill', () => {
  const waybills = ref<Waybill[]>([])
  const loading = ref(false)
  const searchKeyword = ref('')
  const activeFilter = ref<FilterType>('all')
  const expandedId = ref<string | null>(null)

  const filteredWaybills = computed(() => {
    let result = waybills.value

    if (activeFilter.value !== 'all') {
      result = result.filter((item) => item.status === activeFilter.value)
    }

    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.trim().toLowerCase()
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(keyword) ||
          item.receiver.includes(keyword)
      )
    }

    return result
  })

  const stats = computed(() => ({
    all: waybills.value.length,
    in_transit: waybills.value.filter((item) => item.status === 'in_transit').length,
    signed: waybills.value.filter((item) => item.status === 'signed').length,
    exception: waybills.value.filter((item) => item.status === 'exception').length
  }))

  async function loadWaybills() {
    loading.value = true
    try {
      waybills.value = await fetchWaybills()
    } finally {
      loading.value = false
    }
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  function setActiveFilter(filter: FilterType) {
    activeFilter.value = filter
  }

  function toggleExpand(id: string) {
    expandedId.value = expandedId.value === id ? null : id
  }

  return {
    waybills,
    loading,
    searchKeyword,
    activeFilter,
    expandedId,
    filteredWaybills,
    stats,
    loadWaybills,
    setSearchKeyword,
    setActiveFilter,
    toggleExpand
  }
})
