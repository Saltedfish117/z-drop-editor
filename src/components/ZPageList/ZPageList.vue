<script setup lang="ts">
import { defineOptions, defineEmits, defineModel } from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
defineOptions({
  name: "ZPageList",
});
interface Item {
  label: string;
  id: string;
}
const emits = defineEmits(["remove"]);
const select = defineModel<Item>("select");
const list = defineModel<Item[]>("list", {
  required: true,
});
const setSelect = (item: Item) => {
  select.value = item;
};
const removePage = (item: Item, i: number) => {
  emits("remove", item);
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
        ><ZSvgIcon size="sm" name="shanchu_1"></ZSvgIcon
      ></ZBtn>
    </li>
  </ul>
</template>
<style scoped lang="scss">
.z-page-list {
  list-style: none;
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
    margin-bottom: 8px;
    box-shadow: 0 1px 3px rgba(var(--z-quiet), 0.6);
    cursor: pointer;
    &.active {
      background: rgba(var(--z-quiet), 0.2);
      // background-color: rgb(var(--z-page));
    }
    &:hover {
      // background: rgba(var(--z-quiet), 0.1);
    }
  }
}
</style>
