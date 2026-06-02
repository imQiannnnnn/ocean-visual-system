import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { datasetPanelMock, type DatasetVariableOption } from "../mock/dataset";

// 数据集变量类型，从 mock 数据中的变量 value 自动推导
export type DatasetVariable = DatasetVariableOption["value"];

// 图层配置类型，用于地图图层渲染时读取当前数据集配置
export interface DatasetLayerConfig {
  variable: DatasetVariable;
  maskVisible: boolean;
  minValue: number;
  maxValue: number;
}

// 将输入框中的字符串数值转换为 number
// 如果转换失败，则使用默认值 fallback
const parseRangeValue = (value: string, fallback: number) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

export const useDatasetStore = defineStore("dataset", () => {
  // 是否显示掩膜图层
  const maskVisible = ref(false);

  // 当前选中的数据变量，默认显示温度
  const currentVariable = ref<DatasetVariable>("temperature");

  // 色标范围最小值和最大值
  // 使用字符串是为了方便和输入框组件进行双向绑定
  const minValue = ref("-1.0");
  const maxValue = ref("1.0");

  // 数据集面板的静态配置数据
  const dateRange = datasetPanelMock.dateRange;
  const datasetTitle = datasetPanelMock.title;
  const variables = datasetPanelMock.variables;
  const scaleTicks = datasetPanelMock.scaleTicks;

  // 根据当前 Store 状态生成图层配置
  // 地图组件可以监听该配置变化，并更新对应图层
  const layerConfig = computed<DatasetLayerConfig>(() => ({
    variable: currentVariable.value,
    maskVisible: maskVisible.value,
    minValue: parseRangeValue(minValue.value, -1),
    maxValue: parseRangeValue(maxValue.value, 1),
  }));

  // 切换当前显示的数据变量
  const setCurrentVariable = (variable: DatasetVariable) => {
    currentVariable.value = variable;
  };

  return {
    currentVariable,
    datasetTitle,
    dateRange,
    layerConfig,
    maskVisible,
    maxValue,
    minValue,
    scaleTicks,
    setCurrentVariable,
    variables,
  };
});
