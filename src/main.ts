import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { createPinia } from "pinia";
import App from "./App.vue";

import "cesium/Build/Cesium/Widgets/widgets.css";
import "./styles/global.scss";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(createPinia());

app.mount("#app");
