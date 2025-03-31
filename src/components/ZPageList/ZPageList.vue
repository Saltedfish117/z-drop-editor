<script setup lang="ts">
import { defineOptions, defineEmits, defineModel } from "vue";
import type { Item } from "./type";
import ZBtn from "../ZBtn/ZBtn.vue";
import ZIcon from "../ZIcon/ZIcon.vue";
import ZPopup from "../ZPopup/ZPopup.vue";
defineOptions({
  name: "ZPageList",
});

const emits = defineEmits(["remove"]);
const select = defineModel<Item>("select");
const list = defineModel<Item[]>("list", {
  required: true,
});
const setSelect = (item: Item) => {
  select.value = item;
};
const submitRemove = (close: () => void, item: Item) => {
  emits("remove", item);
  close();
};
</script>
<template>
  <ul class="z-page-list">
    <li
      class="z-page-list-item"
      :class="{
        active: select?.id === item.id,
      }"
      v-for="item in list"
      :key="item.id"
      @click="setSelect(item)"
    >
      <span>{{ item.label }}</span>
      <ZBtn v-if="list.length !== 1" color="text-danger" :padding="false">
        <ZPopup>
          <template #default="{ close }">
            <div
              style="margin-top: 4px; display: flex; justify-content: flex-end; gap: 4px"
            >
              <ZBtn @click="close">取消</ZBtn>
              <ZBtn color="primary" @click="submitRemove(close, item)">确定</ZBtn>
            </div>
          </template> </ZPopup
        ><ZIcon size="sm" name="shanchu_1"></ZIcon
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
