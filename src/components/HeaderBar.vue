<template>
  <header class="header-bar">
    <!-- 地方天气 -->
    <div class="weather">
      <el-icon class="icon"><LocationFilled /></el-icon>
      <span>广州</span>
      <span>多云</span>
      <span>27 - 32 ℃</span>
    </div>

    <!-- 中间标题部分 -->
    <div class="title">海洋要素可视化系统</div>

    <!-- 用户信息部分 -->
    <div class="user-area">
      <span>系统管理</span>
      <el-icon class="icon"><UserFilled /></el-icon>
      <span>Admin</span>
      <span>退出登录</span>
    </div>

    <nav class="nav-menu">
      <span>首页</span>
      <span>AI模型</span>
      <span>卫星数据</span>
      <span>观测及其重构产品</span>
      <span>模式再分析数据</span>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { LocationFilled, UserFilled } from "@element-plus/icons-vue";
</script>

<style scoped lang="scss">
.header-bar {
  position: relative;
  height: 150px;
  background: linear-gradient(180deg, #113c86 0%, #071638 100%);
  border-bottom: 1px solid rgba(89, 178, 255, 0.35);
}

.title {
  position: absolute;
  left: 50%;
  top: 22px;
  transform: translateX(-50%);
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 0 12px rgba(92, 184, 255, 0.8);
}

.weather {
  position: absolute;
  left: 40px;
  top: 36px;
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 14px;
}

.user-area {
  position: absolute;
  right: 44px;
  top: 36px;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
}

.nav-menu {
  position: absolute;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  display: flex;
  gap: 58px;
  font-size: 15px;
  font-weight: 600;

  span {
    cursor: pointer;
  }
}

.icon {
  font-size: 20px;
}
</style>
