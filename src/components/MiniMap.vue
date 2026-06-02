<template>
  <div class="mini-map"></div>
</template>

<style scoped lang="scss">
.mini-map {
  position: absolute;
  right: 36px;
  bottom: 30px;
  z-index: 25;

  width: 78px;
  height: 54px;

  border: 3px solid rgba(104, 216, 255, 0.8);
  background: url("../assets/images/mini-map.png") center / cover no-repeat;
}
</style>
