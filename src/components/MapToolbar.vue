<template>
  <div class="map-toolbar">
    <div class="tool-item" @click="$emit('curtain')">
      <el-icon><Crop /></el-icon>
      <span>卷帘</span>
    </div>

    <div class="tool-item" @click="$emit('zoom-in')">
      <el-icon><CirclePlus /></el-icon>
      <span>放大</span>
    </div>

    <div class="tool-item" @click="$emit('zoom-out')">
      <el-icon><Remove /></el-icon>
      <span>缩小</span>
    </div>

    <div class="tool-item" @click="$emit('reset')">
      <el-icon><RefreshLeft /></el-icon>
      <span>复位</span>
    </div>

    <div class="tool-item" @click="$emit('toggle-legend')">
      <el-switch v-model="legendVisible" size="small" />
      <span>图例</span>
    </div>

    <div class="tool-item" @click="$emit('fullscreen')">
      <el-icon><FullScreen /></el-icon>
      <span>全屏</span>
    </div>

    <div class="tool-item">
      <el-icon><Rank /></el-icon>
      <span>保存专题</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineEmits([
  "curtain",
  "zoom-in",
  "zoom-out",
  "reset",
  "toggle-legend",
  "fullscreen",
]);

const legendVisible = ref(true);
</script>

<style scoped lang="scss">
.map-toolbar {
  position: absolute;
  left: 20px;
  top: 16px;
  z-index: 30;
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 12px;
  background: #f8fcff;
  border: 3px solid #67d8ff;
  border-radius: 6px;
  color: #0d3b92;
  box-shadow: 0 0 12px rgba(89, 210, 255, 0.7);
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-width: 46px;
  height: 46px;
  font-size: 12px;
  cursor: pointer;

  .el-icon {
    font-size: 22px;
    margin-bottom: 2px;
  }

  &:hover {
    color: #008cff;
  }
}
</style>
