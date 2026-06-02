<template>
  <!-- Cesium 地图挂载容器，必须保证该 div 或其父容器有宽高，否则地图可能不显示 -->
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import {
  Viewer,
  Cartesian3,
  Color,
  Math as CesiumMath,
  UrlTemplateImageryProvider,
  LabelStyle,
  VerticalOrigin,
  Cartesian2,
  HeightReference,
  DistanceDisplayCondition,
} from "cesium";

// 地图容器 DOM 引用，用于承载 Cesium Viewer
const mapContainer = ref<HTMLDivElement | null>(null);

// Cesium 地图实例
let viewer: Viewer | null = null;

// 初始化 + 重置地图视角
const setInitialCameraView = () => {
  if (!viewer) return;

  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(142, 18, 3200000),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-72),
      roll: 0,
    },
  });
};

// 卫星影像地图，地名文字不会自动显示，需要额外添加“地理位置标注”
interface GeoLabelItem {
  name: string;
  lon: number;
  lat: number;
  height?: number;
}

const geoLabels: GeoLabelItem[] = [
  { name: "东海", lon: 126.5, lat: 28.5 },
  { name: "南海", lon: 114.5, lat: 14.5 },
  { name: "太平洋", lon: 145.0, lat: 20.0 },
  { name: "台湾海峡", lon: 120.0, lat: 24.0 },
  { name: "菲律宾海", lon: 134.0, lat: 17.0 },

  { name: "中国", lon: 112.0, lat: 32.0 },
  { name: "台湾", lon: 121.0, lat: 23.8 },
  { name: "日本", lon: 138.0, lat: 36.0 },
  { name: "菲律宾", lon: 122.0, lat: 12.5 },
  { name: "越南", lon: 108.0, lat: 16.0 },
];

const addGeoLabels = () => {
  if (!viewer) return;

  geoLabels.forEach((item) => {
    viewer!.entities.add({
      name: `geo-label-${item.name}`,
      position: Cartesian3.fromDegrees(item.lon, item.lat, item.height ?? 1000),
      label: {
        text: item.name,
        font: "16px Microsoft YaHei",
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 3,
        style: LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: VerticalOrigin.CENTER,
        pixelOffset: new Cartesian2(0, 0),

        // 距离太远时隐藏，避免满屏都是文字
        distanceDisplayCondition: new DistanceDisplayCondition(0, 9000000),

        // 防止文字被地球表面遮挡
        disableDepthTestDistance: Number.POSITIVE_INFINITY,

        // 贴近地表
        heightReference: HeightReference.CLAMP_TO_GROUND,
      },
    });
  });
};

// 初始化 Cesium 地图
const initViewer = () => {
  // DOM 未挂载完成时不初始化，避免 Cesium 找不到容器
  if (!mapContainer.value) return;

  viewer = new Viewer(mapContainer.value, {
    // 关闭 Cesium 默认控件，适合自定义大屏界面
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,

    // 允许场景动画运行
    shouldAnimate: true,
  });

  // 隐藏 Cesium 默认版权信息，正式项目需根据地图服务协议处理
  const credit = viewer.cesiumWidget.creditContainer as HTMLElement;
  credit.style.display = "none";

  // 设置相机初始视角，形成斜视地球效果
  setInitialCameraView();

  // 移除 Cesium 默认底图
  viewer.imageryLayers.removeAll();

  // 添加自定义瓦片底图
  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    }),
  );

  // 添加地理位置文字
  addGeoLabels();
};

// 地图放大
const zoomIn = () => {
  viewer?.camera.zoomIn(500000);
};

// 地图缩小
const zoomOut = () => {
  viewer?.camera.zoomOut(500000);
};

// 重置地图视角
const resetView = () => {
  setInitialCameraView();
};

// 组件挂载后初始化 Cesium
onMounted(() => {
  initViewer();
});

// 组件卸载前销毁 Cesium 实例和事件处理器，防止内存泄漏
onBeforeUnmount(() => {
  viewer?.destroy();
});

// 暴露方法给父组件调用，例如父组件按钮控制地图放大、缩小、复位、加载图层
defineExpose({
  zoomIn,
  zoomOut,
  resetView,
});
</script>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
}
</style>
