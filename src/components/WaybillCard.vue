<template>
  <div
    class="waybill-card"
    :class="[`status-${waybill.status}`, { expanded: isExpanded }]"
    @click="handleToggle"
  >
    <div class="card-header">
      <div class="card-left">
        <span class="waybill-id">{{ waybill.id }}</span>
        <span
          v-if="waybill.status === 'exception'"
          class="exception-dot"
          title="异常运单"
        ></span>
      </div>
      <span class="status-badge" :class="`status-${waybill.status}`">
        {{ statusText }}
      </span>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="label">收件人：</span>
        <span class="value">{{ waybill.receiver }}</span>
      </div>
      <div class="info-row">
        <span class="label">收件地址：</span>
        <span class="value address">{{ waybill.address }}</span>
      </div>
      <div class="info-row">
        <span class="label">当前状态：</span>
        <span class="value current-node">{{ waybill.currentNode }}</span>
      </div>
      <div class="info-row time-row">
        <span class="update-time">更新于 {{ waybill.updateTime }}</span>
      </div>
    </div>

    <div class="expand-indicator">
      <span>{{ isExpanded ? '收起' : '查看详情' }}</span>
      <svg
        class="arrow-icon"
        :class="{ rotated: isExpanded }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <Transition name="expand">
      <div v-show="isExpanded" class="card-detail">
        <div class="detail-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
          物流轨迹
        </div>
        <Timeline :nodes="sortedTimeline" :current-status="waybill.status" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Waybill } from '@/types'
import { useWaybillStore } from '@/stores/waybill'
import Timeline from './Timeline.vue'

const props = defineProps<{
  waybill: Waybill
}>()

const store = useWaybillStore()

const isExpanded = computed(() => store.expandedId === props.waybill.id)

const statusText = computed(() => {
  const map: Record<string, string> = {
    in_transit: '在途',
    signed: '已签收',
    exception: '异常'
  }
  return map[props.waybill.status]
})

const sortedTimeline = computed(() => {
  return [...props.waybill.timeline].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  )
})

function handleToggle() {
  store.toggleExpand(props.waybill.id)
}
</script>

<style scoped>
.waybill-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.waybill-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.waybill-card.expanded {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.waybill-card.status-in_transit {
  border-left-color: #3b82f6;
}

.waybill-card.status-signed {
  border-left-color: #22c55e;
}

.waybill-card.status-exception {
  border-left-color: #ef4444;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.waybill-id {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Courier New', monospace;
}

.exception-dot {
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.status-in_transit {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.status-signed {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.status-exception {
  background: #fee2e2;
  color: #b91c1c;
}

.card-body {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #6b7280;
  flex-shrink: 0;
  min-width: 72px;
}

.value {
  color: #374151;
  flex: 1;
}

.address {
  word-break: break-all;
}

.current-node {
  color: #1f2937;
  font-weight: 500;
}

.time-row {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
}

.update-time {
  color: #9ca3af;
  font-size: 12px;
}

.expand-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.card-detail {
  overflow: hidden;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 20px 0 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.detail-title svg {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
