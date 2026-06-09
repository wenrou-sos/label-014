<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">物流运单追踪面板</h1>
      <p class="app-subtitle">快递站点调度员专用</p>
    </header>
    <main class="app-main">
      <WaybillList />
    </main>
  </div>
</template>

<script setup lang="ts">
import WaybillList from '@/components/WaybillList.vue'
</script>
