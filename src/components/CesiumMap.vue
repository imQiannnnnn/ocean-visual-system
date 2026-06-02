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
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartographic,
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

// 鼠标事件处理器，用于监听地图交互事件
let handler: ScreenSpaceEventHandler | null = null;

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

  // 绑定地图鼠标事件
  bindMapEvent();
};

// 绑定地图交互事件
const bindMapEvent = () => {
  if (!viewer) return;

  // 基于 Cesium canvas 创建鼠标事件处理器
  handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

  // 监听鼠标移动事件
  handler.setInputAction((movement: any) => {
    if (!viewer) return;

    // 将鼠标屏幕坐标转换为地球椭球面上的三维坐标
    const cartesian = viewer.camera.pickEllipsoid(
      movement.endPosition,
      viewer.scene.globe.ellipsoid,
    );

    // 鼠标没有落在地球表面时，cartesian 可能为空
    if (!cartesian) return;

    // 将三维笛卡尔坐标转换为经纬度坐标
    const cartographic = Cartographic.fromCartesian(cartesian);

    // Cesium 内部经纬度是弧度制，这里转换为角度并保留 4 位小数
    const lon = CesiumMath.toDegrees(cartographic.longitude).toFixed(4);
    const lat = CesiumMath.toDegrees(cartographic.latitude).toFixed(4);

    // 可替换为 emit，将经纬度传给父组件展示
    console.log("lon:", lon, "lat:", lat);
  }, ScreenSpaceEventType.MOUSE_MOVE);
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

// 加载模拟海流图层
const loadOceanLayer = () => {
  if (!viewer) return;

  // 加载前先清除旧图层，避免重复添加
  clearOceanLayer();

  // 模拟海流数据：lon、lat 表示起点，u、v 表示方向偏移
  const mockCurrentData = [
    { lon: 112, lat: 20, u: 3, v: 1 },
    { lon: 116, lat: 21, u: 2, v: -1 },
    { lon: 120, lat: 22, u: 3, v: 2 },
    { lon: 124, lat: 23, u: -2, v: 1 },
    { lon: 128, lat: 25, u: -1, v: 2 },
  ];

  mockCurrentData.forEach((item) => {
    viewer?.entities.add({
      // 统一命名，方便后续批量清除该图层
      name: "ocean-current-layer",
      polyline: {
        // 用起点和终点绘制一条线段，模拟海流方向
        positions: Cartesian3.fromDegreesArray([
          item.lon,
          item.lat,
          item.lon + item.u,
          item.lat + item.v,
        ]),
        width: 2,
        material: Color.CYAN.withAlpha(0.75),
      },
    });
  });
};

// 清除海流图层
const clearOceanLayer = () => {
  if (!viewer) return;

  // 找出所有海流图层实体
  const entities = viewer.entities.values.filter(
    (entity) => entity.name === "ocean-current-layer",
  );

  // 从地图中移除这些实体
  entities.forEach((entity) => {
    viewer?.entities.remove(entity);
  });
};

// 组件挂载后初始化 Cesium
onMounted(() => {
  initViewer();
});

// 组件卸载前销毁 Cesium 实例和事件处理器，防止内存泄漏
onBeforeUnmount(() => {
  handler?.destroy();
  viewer?.destroy();
});

// 暴露方法给父组件调用，例如父组件按钮控制地图放大、缩小、复位、加载图层
defineExpose({
  zoomIn,
  zoomOut,
  resetView,
  loadOceanLayer,
});
</script>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
}
</style>
