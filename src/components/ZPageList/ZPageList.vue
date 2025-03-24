<script setup lang="ts">
import { defineOptions, defineProps, defineModel } from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
defineOptions({
  name: "ZPageList",
});
interface Item {
  label: string;
  id: string;
}
const select = defineModel<Item>("select");
const list = defineModel<Item[]>("list", {
  required: true,
});
const setSelect = (item: Item) => {
  select.value = item;
};
const removePage = (_: Item, i: number) => {
  list.splice(i, 1);
  // if (select?.id === item.id) {
  //   select.value = list[0];
  // }
};
</script>
<template>
  <ul class="z-page-list">
    <li
      class="z-page-list-item"
      :class="{
        active: select?.id === item.id,
      }"
      v-for="(item, i) in list"
      :key="item.id"
      @click="setSelect(item)"
    >
      <span>{{ item.label }}</span>
      <ZBtn
        v-if="list.length !== 1"
        @click.stop="removePage(item, i)"
        color="text-danger"
        :padding="false"
        >删除</ZBtn
      >
    </li>
  </ul>
</template>
<style scoped lang="scss">
.z-page-list {
  list-style: none;
  // background-color: rgba(var(--z-quiet), 0.3);
  position: relative;
  padding: 4px 8px;
  margin: 0;
  .z-page-list-item {
    padding: 4px 8px;
    background-color: rgb(var(--z-page));
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    font-size: var(--z-font-sm);
    min-height: 20px;
    // border: 1px solid transparent;
    border: 1px solid rgb(var(--z-quiet));
    &.active {
      // border: 1px solid rgb(var(--z-quiet));
      background: rgba(var(--z-quiet), 0.3);
    }
  }
}
</style>
