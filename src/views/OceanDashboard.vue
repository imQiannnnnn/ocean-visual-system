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

        <!-- 图表显示 -->
        <ChartPopup v-if="showChart" @close="showChart = false" />

        <!-- 图例部分-左下角 -->
        <LegendBox v-if="showLegend" />

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
import CesiumMap from "../components/CesiumMap.vue";
import ChartPopup from "../components/ChartPopup.vue";
import DatasetPanel from "../components/DatasetPanel.vue";
import HeaderBar from "../components/HeaderBar.vue";
import LeftTopicMenu from "../components/LeftTopicMenu.vue";
import LegendBox from "../components/LegendBox.vue";
import MapToolbar from "../components/MapToolbar.vue";
import MiniMap from "../components/MiniMap.vue";

import { initialCoordinate } from "../mock/dashboard";
import { useDatasetStore } from "../stores/dataset";

const datasetStore = useDatasetStore();
const mapRef = ref<InstanceType<typeof CesiumMap> | null>(null);

const showLegend = ref(true);
const showChart = ref(true);
const longitude = ref(initialCoordinate.longitude);
const latitude = ref(initialCoordinate.latitude);

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
  const el = document.querySelector(".map-wrapper") as HTMLElement | null;
  el?.requestFullscreen?.();
};

const handleShowLayer = () => {
  mapRef.value?.loadOceanLayer(datasetStore.layerConfig);
};
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
