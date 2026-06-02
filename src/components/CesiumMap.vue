<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  LabelStyle,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  UrlTemplateImageryProvider,
  VerticalOrigin,
  Viewer,
} from "cesium";
import { mockGeoLabels, mockOceanCurrentData } from "../mock/map";
import type { DatasetLayerConfig } from "../stores/dataset";

const OCEAN_CURRENT_LAYER_NAME = "ocean-current-layer";

const mapContainer = ref<HTMLDivElement | null>(null);

let viewer: Viewer | null = null;
let handler: ScreenSpaceEventHandler | null = null;

const getLayerMaterial = (config: DatasetLayerConfig) => {
  if (config.variable === "salinity") {
    return Color.ORANGE.withAlpha(config.maskVisible ? 0.9 : 0.75);
  }

  return Color.CYAN.withAlpha(config.maskVisible ? 0.9 : 0.75);
};

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

const addGeoLabels = () => {
  if (!viewer) return;

  mockGeoLabels.forEach((item) => {
    viewer?.entities.add({
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
        distanceDisplayCondition: new DistanceDisplayCondition(0, 9000000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: HeightReference.CLAMP_TO_GROUND,
      },
    });
  });
};

const bindMapEvent = () => {
  if (!viewer) return;

  handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction((movement: { endPosition: Cartesian2 }) => {
    if (!viewer) return;

    const cartesian = viewer.camera.pickEllipsoid(
      movement.endPosition,
      viewer.scene.globe.ellipsoid,
    );

    if (!cartesian) return;

    const cartographic = Cartographic.fromCartesian(cartesian);
    const lon = CesiumMath.toDegrees(cartographic.longitude).toFixed(4);
    const lat = CesiumMath.toDegrees(cartographic.latitude).toFixed(4);

    console.log("lon:", lon, "lat:", lat);
  }, ScreenSpaceEventType.MOUSE_MOVE);
};

const initViewer = () => {
  if (!mapContainer.value) return;

  viewer = new Viewer(mapContainer.value, {
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
    shouldAnimate: true,
  });

  const credit = viewer.cesiumWidget.creditContainer as HTMLElement;
  credit.style.display = "none";

  setInitialCameraView();

  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    }),
  );

  addGeoLabels();
  bindMapEvent();
};

const zoomIn = () => {
  viewer?.camera.zoomIn(500000);
};

const zoomOut = () => {
  viewer?.camera.zoomOut(500000);
};

const resetView = () => {
  setInitialCameraView();
};

const loadOceanLayer = (config: DatasetLayerConfig) => {
  if (!viewer) return;

  clearOceanLayer();

  mockOceanCurrentData.forEach((item) => {
    viewer?.entities.add({
      name: OCEAN_CURRENT_LAYER_NAME,
      description: `variable=${config.variable}; range=${config.minValue}-${config.maxValue}`,
      polyline: {
        positions: Cartesian3.fromDegreesArray([
          item.lon,
          item.lat,
          item.lon + item.u,
          item.lat + item.v,
        ]),
        width: config.maskVisible ? 3 : 2,
        material: getLayerMaterial(config),
      },
    });
  });
};

const clearOceanLayer = () => {
  if (!viewer) return;

  const entities = viewer.entities.values.filter(
    (entity) => entity.name === OCEAN_CURRENT_LAYER_NAME,
  );

  entities.forEach((entity) => {
    viewer?.entities.remove(entity);
  });
};

onMounted(() => {
  initViewer();
});

onBeforeUnmount(() => {
  handler?.destroy();
  viewer?.destroy();
});

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
