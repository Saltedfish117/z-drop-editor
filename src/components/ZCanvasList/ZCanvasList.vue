<script setup lang="ts">
import { defineOptions, nextTick, defineModel } from "vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
import ZBtn from "../ZBtn/ZBtn.vue";
defineOptions({
  name: "ZCanvasList",
});
interface Item {
  label: string;
  id: string;
}
const select = defineModel<Item>("select", {
  required: true,
});
const list = defineModel<Item[]>("list", {
  required: true,
});
const setSelect = (item: Item) => {
  select.value = item;
};
const removeCanvas = (id: string) => {
  if (list.value.length === 1) return;
  let newCanvasList = list.value.filter((i) => i.id !== id);
  list.value = newCanvasList;
  nextTick(() => {
    if (id === select.value.id) {
      select.value = list.value[0];
    }
  });
};
</script>
<template>
  <ul class="z-canvas-list">
    <li
      class="z-canvas-list-item"
      v-for="(item, i) in list"
      :key="item.id"
      @click="setSelect(item)"
      :class="{
        active: select?.id === item.id,
      }"
    >
      <span>
        {{ item.label }}
      </span>
      <ZBtn
        v-if="list.length !== 1"
        @click.stop="removeCanvas(item.id)"
        color="text-danger"
        :padding="false"
      >
        <ZSvgIcon name="shanchu_1" size="sm"></ZSvgIcon>
      </ZBtn>
    </li>
  </ul>
</template>
<style scoped lang="scss">
.z-canvas-list {
  .z-canvas-list-item {
  }
}
</style>
