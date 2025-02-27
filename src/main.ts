import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import A4 from "./components/A4/A4.vue";

const app = createApp(App);
app.component("a4", A4);
app.mount("#app");
