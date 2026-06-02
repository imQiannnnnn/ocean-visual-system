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

        <!-- 数据面板 -->
        <DatasetPanel @show-layer="handleShowLayer" />

        <!-- 图例部分-左下角 -->
        <LegendBox />

        <!-- 小地图部分-右下角 -->
        <MiniMap />

        <!-- 经纬度显示 -->
        <div class="coordinate-text">
          经度：{{ longitude }} 纬度：{{ latitude }}
        </div>
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
import DatasetPanel from "../components/DatasetPanel.vue";
import LegendBox from "../components/LegendBox.vue";
import MiniMap from "../components/MiniMap.vue";

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

const handleShowLayer = () => {
  // mapRef.value?.loadOceanLayer();
  console.log("数据显示");
};

const longitude = ref("106°27′30.00″");
const latitude = ref("27°30′23.12″");
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

.coordinate-text {
  position: absolute;
  top: 8px;
  right: 220px;
  z-index: 20;
  font-size: 14px;
  color: #fff;
}
</style>
