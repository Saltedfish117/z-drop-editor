<script setup lang="ts">
import { defineOptions, defineModel } from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
import type { ZCanvasList, ZCanvas, ZDragNode, ZMap } from "@/common/type";
defineOptions({
  name: "ZDesign",
});
const canvas = defineModel<ZCanvasList>("canvas", {
  required: true,
});
const selectCanvas = defineModel<ZCanvas>("selectCanvas");
const selectNode = defineModel<ZDragNode>("selectNode");
const treeMap = defineModel<ZMap>("treeMap");
</script>
<template>
  <div class="z-design">
    <div class="z-design_top">
      <div class="canvas-header">
        <h6 class="title">画布</h6>
        <div>
          <ZBtn :padding="false" color="text-default">
            <ZSvgIcon size="sm" name="plus"></ZSvgIcon>
          </ZBtn>
        </div>
      </div>
      <ul class="canvas-list">
        <li class="canvas-list-item" v-for="canvas in canvas">
          <span>
            {{ canvas.label }}
          </span>
        </li>
      </ul>
    </div>
    <div class="line"></div>
    <div class="z-design_bottom"></div>
  </div>
</template>
<style scoped lang="scss">
.z-design {
  width: 100%;
  height: 100%;
  max-height: 100%;
  .z-design_top {
    width: 100%;
    min-height: 20%;
    height: 35%;
    max-height: 50%;
    .canvas-header {
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: var(--z-font-sm);
        font-weight: 500;
        padding: 0;
        margin: 0;
      }
      border: 1px solid rgb(var(--z-quiet));
      border-top: none;
      // border-radius: 0 0 16px 16px;
      box-shadow: 0px 3px 5px -4px rgba(64, 87, 109, 0.3);
    }
    .canvas-list {
      list-style: none;
      padding: 8px 4px;
      margin: 0;
      .canvas-list-item {
        padding: 4px 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--z-font-sm);
        border-bottom: 1px solid rgb(var(--z-quiet));
        border-radius: 4px;
        &:hover {
          box-shadow: 0px 6px 20px -4px rgba(64, 87, 109, 0.3),
            0px 0px 0px 1px rgba(64, 87, 109, 0.04);
          // box-shadow: 0px 4px 10px 0px rgba(var(--z-quiet), 0.6),
          //   0px 0px 0px 1px rgba(var(--z-quiet), 0.04);
        }
        &.active {
          border: 1px solid rgb(var(--z-quiet));
        }
      }
    }
  }
  .z-design_bottom {
    width: 100%;
    height: 50%;
    max-height: 80%;
  }
  .line {
    height: 1px;
    background: rgb(var(--z-quiet));
    width: 100%;
  }
}
</style>
