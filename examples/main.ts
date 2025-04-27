import { createApp } from "vue";
import App from "./App.vue";
import Rectangle from "./Rectangle.vue";
import ZDragEditor from "../src/index.ts";
const app = createApp(App);
app.use(ZDragEditor);
app.component("Rectangle", Rectangle);
app.mount("#app");
