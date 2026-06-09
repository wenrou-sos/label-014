<template>
  <div class="timeline">
    <div
      v-for="(node, index) in nodes"
      :key="index"
      class="timeline-item"
      :class="{ first: index === 0 }"
    >
      <div class="timeline-marker">
        <div class="marker-dot" :class="{ active: index === 0 }"></div>
        <div v-if="index < nodes.length - 1" class="marker-line"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-status" :class="{ 'status-exception': isExceptionStatus(index) }">
            {{ node.status }}
          </span>
        </div>
        <div class="timeline-info">
          <span class="timeline-location">{{ node.location }}</span>
          <span class="timeline-time">{{ node.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogisticsNode, WaybillStatus } from '@/types'

const props = defineProps<{
  nodes: LogisticsNode[]
  currentStatus: WaybillStatus
}>()

function isExceptionStatus(index: number): boolean {
  return index === 0 && props.currentStatus === 'exception'
}
</script>

<style scoped>
.timeline {
  padding-left: 4px;
}

.timeline-item {
  display: flex;
  gap: 16px;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  flex-shrink: 0;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
  border: 3px solid #fff;
  box-shadow: 0 0 0 1px #d1d5db;
  flex-shrink: 0;
  z-index: 1;
}

.marker-dot.active {
  background: #3b82f6;
  box-shadow: 0 0 0 2px #dbeafe;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.marker-line {
  width: 2px;
  flex: 1;
  background: #e5e7eb;
  margin: 4px 0;
  min-height: 40px;
}

.timeline-content {
  flex: 1;
  padding-bottom: 24px;
}

.timeline-item:first-child .timeline-content {
  padding-top: 0;
}

.timeline-item:last-child .timeline-content {
  padding-bottom: 0;
}

.timeline-header {
  margin-bottom: 6px;
}

.timeline-status {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

.timeline-status.status-exception {
  color: #b91c1c;
}

.timeline-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-location {
  font-size: 13px;
  color: #6b7280;
}

.timeline-time {
  font-size: 12px;
  color: #9ca3af;
}
</style>
