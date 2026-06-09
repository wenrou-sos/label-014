<template>
  <div class="waybill-list-container">
    <div class="search-section">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchInput"
          type="text"
          class="search-input"
          placeholder="输入运单号或收件人姓名搜索..."
          @input="handleSearch"
        />
        <button
          v-if="searchInput"
          class="clear-btn"
          @click="clearSearch"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="filter-section">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: store.activeFilter === tab.value }"
        @click="handleFilterChange(tab.value)"
        type="button"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-count" :class="`count-${tab.value}`">
          {{ store.stats[tab.value] }}
        </span>
      </button>
    </div>

    <div v-if="store.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载运单数据...</p>
    </div>

    <div v-else-if="store.filteredWaybills.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <p class="empty-title">暂无运单数据</p>
      <p class="empty-desc">
        {{ store.searchKeyword ? '没有找到匹配的运单，请尝试其他关键词' : '当前筛选条件下没有运单' }}
      </p>
    </div>

    <div v-else class="waybill-grid">
      <WaybillCard
        v-for="waybill in store.filteredWaybills"
        :key="waybill.id"
        :waybill="waybill"
      />
    </div>

    <div class="list-footer">
      <span class="footer-info">
        共 {{ store.filteredWaybills.length }} 条运单
        <template v-if="store.activeFilter !== 'all' || store.searchKeyword">
          （筛选自 {{ store.stats.all }} 条）
        </template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FilterType } from '@/types'
import { useWaybillStore } from '@/stores/waybill'
import WaybillCard from './WaybillCard.vue'

const store = useWaybillStore()
const searchInput = ref('')

const filterTabs: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '在途', value: 'in_transit' },
  { label: '已签收', value: 'signed' },
  { label: '异常', value: 'exception' }
]

let searchTimer: ReturnType<typeof setTimeout> | null = null

function handleSearch() {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    store.setSearchKeyword(searchInput.value)
  }, 200)
}

function clearSearch() {
  searchInput.value = ''
  store.setSearchKeyword('')
}

function handleFilterChange(filter: FilterType) {
  store.setActiveFilter(filter)
}

onMounted(() => {
  store.loadWaybills()
})
</script>

<style scoped>
.waybill-list-container {
  width: 100%;
}

.search-section {
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  margin-left: 16px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 16px 12px;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1f2937;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.clear-btn svg {
  width: 16px;
  height: 16px;
}

.filter-section {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-tab.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.tab-label {
  font-weight: 500;
}

.tab-count {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.count-exception {
  color: #b91c1c;
  background: #fee2e2;
}

.filter-tab.active .count-exception {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #6b7280;
  font-size: 14px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #9ca3af;
  text-align: center;
}

.waybill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.list-footer {
  padding: 16px 0;
  text-align: center;
}

.footer-info {
  font-size: 13px;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .waybill-grid {
    grid-template-columns: 1fr;
  }

  .filter-tab {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
