<template>
  <div class="legend-box">
    <div class="legend-item">
      <div class="legend-icon">
        <span class="line red"></span>
      </div>
      <span class="legend-text">图例1</span>
    </div>

    <div class="legend-item">
      <div class="legend-icon">
        <span class="line green"></span>
      </div>
      <span class="legend-text">图例2</span>
    </div>

    <div class="legend-item">
      <div class="legend-icon">
        <span class="circle blue"></span>
      </div>
      <span class="legend-text">图例3</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.legend-box {
  position: absolute;
  left: 22px;
  bottom: 30px;
  z-index: 25;

  width: 118px;
  padding: 10px 8px;
  box-sizing: border-box;

  background: #ffffff;
  border-radius: 5px;
  border: 3px solid #68d7ff;
  color: #333;
  font-size: 12px;
}

.legend-item {
  display: grid;
  grid-template-columns: 54px 1fr;
  align-items: center;
  height: 32px;
}

.legend-icon {
  width: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend-text {
  display: inline-block;
  text-align: left;
  white-space: nowrap;
  font-size: 12px;
  margin-left: 2px;
  color: #333;
}

.line {
  width: 42px;
  height: 10px;
  display: inline-block;
}

.red {
  background: #f5222d;
}

.green {
  background: #18d45b;
}

.circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-block;
}

.blue {
  background: #1aa7e8;
}
</style>
