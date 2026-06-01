<template>
  <aside class="left-menu">
    <button
      v-for="item in topics"
      :key="item.key"
      :class="['topic-btn', { active: activeKey === item.key }]"
      @click="activeKey = item.key"
    >
      {{ item.name }}
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("temperature");

const topics = [
  { key: "temperature", name: "专题数据 · 温度" },
  { key: "salinity", name: "专题数据 · 盐度" },
  { key: "waterLevel", name: "专题数据 · 水位" },
  { key: "weather", name: "专题数据 · 气象" },
  { key: "current", name: "专题数据 · 海流" },
  { key: "ph", name: "专题数据 · PH值" },
  { key: "biology", name: "专题数据 · 生物" },
  { key: "disaster", name: "专题数据 · 灾害" },
];
</script>

<style scoped lang="scss">
.left-menu {
  width: 230px;
  padding: 16px 16px 0;
  box-sizing: border-box;
  background: #071638;
}

.topic-btn {
  width: 100%;
  height: 38px;
  margin-bottom: 20px;
  border: 3px solid #68d7ff;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  background: #153d8b;
  cursor: pointer;
  box-shadow: inset 0 0 12px rgba(91, 210, 255, 0.25);

  &:hover,
  &.active {
    background: #1d55bc;
    box-shadow: 0 0 14px rgba(91, 210, 255, 0.7);
  }
}
</style>
