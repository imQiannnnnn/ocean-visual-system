<template>
  <!-- 图表弹窗容器 -->
  <div class="chart-popup">
    <!-- 弹窗标题栏 -->
    <div class="popup-header">
      <span>洋流 Uo 随时间变化</span>

      <!-- 关闭按钮：点击后向父组件抛出 close 事件 -->
      <el-icon class="close-icon" @click="$emit('close')">
        <Close />
      </el-icon>
    </div>

    <!-- ECharts 图表挂载容器 -->
    <div ref="chartRef" class="chart-box"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { LineChart, type LineSeriesOption } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { init, use, type ComposeOption, type ECharts } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { oceanCurrentChartDates, oceanCurrentChartValues } from "../mock/chart";

// 声明当前组件会向父组件抛出的事件
defineEmits(["close"]);

// ECharts 按需注册组件，减少打包体积
use([GridComponent, LineChart, SVGRenderer, TooltipComponent]);

// 定义图表配置项类型，增强 TypeScript 类型提示
type ChartOption = ComposeOption<
  GridComponentOption | LineSeriesOption | TooltipComponentOption
>;

// 图表 DOM 容器引用
const chartRef = ref<HTMLDivElement | null>(null);

// 保存 ECharts 实例
let chart: ECharts | null = null;

// 监听图表容器尺寸变化，用于自适应布局
let resizeObserver: ResizeObserver | null = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  // 获取图表容器的实际尺寸，避免初始化时宽高为 0
  const rect = chartRef.value.getBoundingClientRect();
  const width = Math.max(rect.width, chartRef.value.clientWidth, 1);
  const height = Math.max(rect.height, chartRef.value.clientHeight, 1);

  // 如果之前已经存在图表实例，先销毁，防止重复渲染和内存泄漏
  chart?.dispose();

  // 初始化 ECharts 实例，使用 SVG 渲染器
  chart = init(chartRef.value, undefined, {
    renderer: "svg",
    width,
    height,
  });

  // 图表核心配置项
  const option: ChartOption = {
    // 背景透明，方便融入大屏背景
    backgroundColor: "transparent",

    // 折线主色
    color: ["#7ea2ff"],

    // 图表边距配置，控制坐标轴和内容区域位置
    grid: {
      left: 54,
      right: 28,
      top: 34,
      bottom: 40,
    },

    // 鼠标悬浮提示框
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(12, 18, 35, 0.88)",
      borderColor: "rgba(126, 162, 255, 0.45)",
      textStyle: {
        color: "#ffffff",
      },
    },

    // X 轴：时间分类轴
    xAxis: {
      type: "category",
      data: [...oceanCurrentChartDates],
      axisLabel: {
        color: "rgba(220, 230, 255, 0.72)",
        fontSize: 12,
        // 每隔 3 个标签显示一次，避免日期过密重叠
        interval: 3,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(190, 204, 236, 0.45)",
        },
      },
      axisTick: {
        show: false,
      },
    },

    // Y 轴：洋流 Uo 数值轴
    yAxis: {
      type: "value",
      min: -0.3,
      max: 0.2,
      interval: 0.1,
      axisLabel: {
        color: "rgba(220, 230, 255, 0.72)",
        fontSize: 12,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(190, 204, 236, 0.45)",
        },
      },
      axisTick: {
        show: false,
      },
      // 网格线样式
      splitLine: {
        lineStyle: {
          color: "rgba(210, 220, 245, 0.34)",
        },
      },
    },

    // 折线图数据配置
    series: [
      {
        type: "line",

        // 数据点样式
        symbol: "circle",
        symbolSize: 4,
        data: oceanCurrentChartValues,
        lineStyle: {
          width: 2,
          color: "#7ea2ff",
          shadowBlur: 8,
          shadowColor: "rgba(255, 126, 126, 0.85)",
        },

        // 数据点样式
        itemStyle: {
          color: "#8fb0ff",
          borderColor: "#bcd0ff",
          borderWidth: 1,
        },

        // 折线下方区域渐变填充
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(74, 110, 214, 0.2)" },
              { offset: 1, color: "rgba(74, 110, 214, 0)" },
            ],
          },
        },
      },
    ],
  };

  // 设置图表配置并渲染
  chart.setOption(option);

  // 初始化后主动 resize，确保图表适配容器大小
  chart.resize();
};

/**
 * 图表尺寸自适应
 * 窗口变化或容器尺寸变化时调用
 */
const resizeChart = () => {
  chart?.resize();
};

// 组件挂载后初始化图表
onMounted(async () => {
  // 等待 DOM 渲染完成后再初始化 ECharts
  await nextTick();

  initChart();

  // 监听图表容器尺寸变化，适合弹窗、布局变化、大屏缩放等场景
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(resizeChart);
    resizeObserver.observe(chartRef.value);
  }

  // 监听浏览器窗口大小变化
  window.addEventListener("resize", resizeChart);
});

// 组件卸载前清理资源，防止内存泄漏
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeChart);

  // 停止监听容器尺寸变化
  resizeObserver?.disconnect();

  // 销毁 ECharts 实例
  chart?.dispose();
});
</script>

<style scoped lang="scss">
/* 图表弹窗整体容器 */
.chart-popup {
  position: absolute;
  right: 46px;
  top: 30px;
  z-index: 25;

  width: 620px;
  height: 230px;
  padding: 8px 16px 14px;
  box-sizing: border-box;

  /* 半透明渐变背景 */
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );

  border: 1px solid rgba(110, 170, 255, 0.22);
  border-radius: 2px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

/* 弹窗标题栏 */
.popup-header {
  position: relative;
  height: 28px;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.45);
}

/* 右上角关闭图标 */
.close-icon {
  position: absolute;
  right: 0;
  top: 2px;
  cursor: pointer;
  font-size: 18px;
}

/* ECharts 图表容器 */
.chart-box {
  width: 100%;
  height: 180px;
}
</style>
