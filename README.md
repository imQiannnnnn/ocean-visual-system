# Ocean Visual System

海洋可视化大屏，当前用于展示海洋数据可视化原型：包含三维地图、数据面板、地图工具栏、图表弹窗、图例和小地图等模块。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Cesium
- ECharts
- Element Plus
- SCSS

## 功能模块

- 三维地图展示：使用 Cesium 加载卫星影像底图。
- 地理标注：展示东海、南海、太平洋等区域标注。
- 数据面板：管理变量、廓线点开关、色带范围等配置。
- 状态管理：使用 `datasetStore` 保存数据面板当前配置。
- 图表弹窗：使用 ECharts 展示洋流 Uo 随时间变化。
- 地图工具栏：支持放大、缩小、复位、图例显隐和全屏。

## 目录结构

```text
src
├─ assets
├─ components
│  ├─ CesiumMap.vue
│  ├─ ChartPopup.vue
│  ├─ DatasetPanel.vue
│  ├─ HeaderBar.vue
│  ├─ LeftTopicMenu.vue
│  ├─ LegendBox.vue
│  ├─ MapToolbar.vue
│  └─ MiniMap.vue
├─ mock
├─ stores
├─ styles
├─ views
├─ App.vue
└─ main.ts
```

## 模拟数据说明

模拟数据集中放在 `src/mock`：

- `chart.ts`：图表日期和曲线数据。
- `map.ts`：地图标注和模拟海流数据。
- `dataset.ts`：数据面板标题、时间范围、变量选项和色带刻度。
- `dashboard.ts`：页面初始经纬度。

## 快速开始

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

## 说明

当前项目仍处于原型阶段，地图图层和图表数据均为 mock 数据。后续可以将 `src/mock` 中的数据替换为接口请求。
