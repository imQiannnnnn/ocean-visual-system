<template>
  <div class="ocean-screen">
    <!-- 顶部导航栏 -->
    <HeaderBar />

    <div class="screen-body">
      <!-- 左侧菜单栏 -->
      <LeftTopicMenu />

      <div class="map-wrapper">
        <!-- 中间地图核心 -->
        <CesiumMap ref="mapRef" />

        <!-- 地图工具栏 -->
        <MapToolbar
          @zoom-in="handleZoomIn"
          @zoom-out="handleZoomOut"
          @reset="handleReset"
          @toggle-legend="showLegend = !showLegend"
          @fullscreen="handleFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HeaderBar from "../components/HeaderBar.vue";
import LeftTopicMenu from "../components/LeftTopicMenu.vue";
import CesiumMap from "../components/CesiumMap.vue";
import MapToolbar from "../components/MapToolbar.vue";

const mapRef = ref<InstanceType<typeof CesiumMap> | null>(null);

// 地图放大
const handleZoomIn = () => {
  mapRef.value?.zoomIn();
};

// 地图缩小
const handleZoomOut = () => {
  mapRef.value?.zoomOut();
};

// 地图重置
const handleReset = () => {
  mapRef.value?.resetView();
};

// 地图全屏
const handleFullscreen = () => {
  const el = document.querySelector(".map-wrapper") as HTMLElement;
  el?.requestFullscreen?.();
};

const showLegend = ref(true);
</script>

<style scoped lang="scss">
.ocean-screen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: #fff;
  background: #071638;
}

.screen-body {
  display: flex;
  height: calc(100vh - 150px);
}

.map-wrapper {
  position: relative;
  flex: 1;
  height: calc(100% - 26px);
  margin: 0 28px 26px 0;
  box-sizing: border-box;
  border: 1px solid rgba(92, 184, 255, 0.7);
  overflow: hidden;
  background: #000;
}
</style>
