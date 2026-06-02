<template>
  <div class="dataset-panel">
    <!-- 可滚动内容区 -->
    <div class="panel-scroll">
      <div class="date-row">
        <span>1900-01</span>
        <span class="date-arrow">→</span>
        <span>2024-12</span>
        <el-icon class="calendar-icon">
          <Calendar />
        </el-icon>
      </div>

      <div class="dataset-title">EN4温盐格点数据(C14)</div>

      <div class="form-row">
        <span class="section-label">变量</span>

        <div class="mask-switch">
          <span>廓线点：</span>
          <el-switch
            v-model="maskVisible"
            inline-prompt
            active-text="开"
            inactive-text="关"
          />
        </div>
      </div>

      <div class="variable-row">
        <button
          v-for="item in variables"
          :key="item.value"
          :class="['variable-btn', { active: currentVariable === item.value }]"
          @click="currentVariable = item.value"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="label-text">色带</div>

      <div class="color-bar">
        <div class="gradient"></div>
        <div class="arrow-box">
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
      </div>

      <div class="scale-row">
        <span>-1.00</span>
        <span>-0.67</span>
        <span>-0.33</span>
        <span>0.00</span>
        <span>0.33</span>
        <span>0.67</span>
        <span>1.00</span>
      </div>

      <div class="range-row">
        <input v-model="minValue" class="value-input" />
        <span class="range-label">最小值</span>
        <span class="range-label">最大值</span>
        <input v-model="maxValue" class="value-input" />
      </div>

      <div class="depth-title">深度</div>

      <!-- 内容变多后，这里会滚动，不会撑大面板 -->
    </div>

    <!-- 固定底部按钮，不参与滚动 -->
    <button class="show-btn" @click="$emit('show-layer')">显 示</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Calendar, ArrowDown } from "@element-plus/icons-vue";

defineEmits(["show-layer"]);

const maskVisible = ref(false);
const currentVariable = ref("temperature");
const minValue = ref("-1.0");
const maxValue = ref("1.0");

const variables = [
  { label: "temper...", value: "temperature" },
  { label: "salinity", value: "salinity" },
];
</script>

<style scoped lang="scss">
.dataset-panel {
  position: absolute;
  left: 28px;
  top: 92px;
  z-index: 25;

  width: 250px;
  height: 350px;
  padding: 12px 12px 46px;
  box-sizing: border-box;

  color: #ffffff;
  font-size: 12px;

  background: rgba(67, 74, 75, 0.66);
  border-radius: 7px;
  backdrop-filter: blur(3px);
  overflow: hidden;

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);
}

/* 可滚动区域 */
.panel-scroll {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  box-sizing: border-box;
}

/* 时间行 */
.date-row {
  display: grid;
  grid-template-columns: 1fr 26px 1fr 20px;
  align-items: center;

  height: 28px;
  padding: 0 8px;
  margin-bottom: 10px;
  box-sizing: border-box;

  background: rgba(39, 44, 55, 0.9);
  color: #e8edf5;
  font-size: 12px;
  border-radius: 5px;
}

.date-arrow {
  text-align: center;
  color: #d9dce2;
}

.calendar-icon {
  font-size: 13px;
  color: #b7beca;
}

/* 数据集标题 */
.dataset-title {
  height: 28px;
  width: 90%;
  line-height: 28px;
  padding-left: 8px;
  margin-bottom: 14px;
  box-sizing: border-box;

  background: rgba(218, 229, 229, 0.16);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

/* 变量行 */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 22px;
  margin-bottom: 12px;
}

.section-label {
  font-size: 13px;
  font-weight: 700;
}

.mask-switch {
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 12px;
  color: #ffffff;
}

.switch-text {
  color: #4aa3ff;
}

/* 变量按钮 */
.variable-row {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.variable-btn {
  width: 66px;
  height: 28px;
  padding: 0;

  border: 1px solid rgba(0, 0, 0, 0.55);
  border-radius: 4px;

  color: #ffffff;
  font-size: 12px;
  font-weight: 700;

  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;

  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.25);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.variable-btn.active {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 0, 0, 0.75);
}

.variable-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(0, 0, 0, 0.85);
}

/* 色带 */
.label-text {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
}

.color-bar {
  display: flex;
  align-items: center;

  height: 28px;
  margin-bottom: 6px;

  background: #101e55;
  border-radius: 3px;
  overflow: hidden;
}

.gradient {
  flex: 1;
  height: 13px;
  margin-left: 7px;

  background: linear-gradient(
    90deg,
    #001cff 0%,
    #007bff 16%,
    #00eaff 32%,
    #00ff4c 48%,
    #ffff00 65%,
    #ff8c00 82%,
    #ff0000 100%
  );
}

.arrow-box {
  width: 20px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
}

/* 色带刻度 */
.scale-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  margin-bottom: 10px;

  color: #ffffff;
  font-size: 10px;
}

.scale-row span {
  text-align: center;
}

/* 最大最小值 */
.range-row {
  display: grid;
  grid-template-columns: 62px 1fr 1fr 62px;
  align-items: center;
  column-gap: 6px;

  margin-bottom: 14px;
}

.value-input {
  width: 62px;
  height: 28px;
  padding: 0;
  box-sizing: border-box;

  border: none;
  outline: none;
  border-radius: 3px;

  color: #ffffff;
  background: rgba(16, 30, 55, 0.95);

  font-size: 12px;
  text-align: center;
}

.range-label {
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

/* 深度 */
.depth-title {
  margin-bottom: 2px;
  font-size: 13px;
  font-weight: 700;
}

.slider-row {
  height: 22px;
  padding: 0 4px;
  box-sizing: border-box;
}

/* 显示按钮固定在右下角 */
.show-btn {
  position: absolute;
  right: 12px;
  bottom: 10px;
  z-index: 5;

  width: 58px;
  height: 30px;

  border: none;
  border-radius: 3px;

  color: #ffffff;
  background: rgba(15, 24, 48, 0.95);

  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
}

.show-btn:hover {
  background: rgba(28, 42, 78, 0.98);
}

/* 滚动条样式 */
.panel-scroll::-webkit-scrollbar {
  width: 4px;
}

.panel-scroll::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.35);
}

.panel-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* Element Plus Switch 覆盖 */
:deep(.el-switch) {
  height: 20px;
}

:deep(.el-switch__core) {
  width: 42px;
  height: 22px;
  min-width: 42px;
  border: none;
  // background: #eef1f7;
}

:deep(.el-switch__core .el-switch__action) {
  width: 18px;
  height: 18px;
}

:deep(.el-switch.is-checked .el-switch__core) {
  background: rgb(27, 39, 59);
}
</style>
