<script setup lang="ts">
import {
	defineOptions,
	defineModel,
	ref,
	computed,
	onMounted,
	watch,
	onUnmounted,
	nextTick,
} from "vue";
import ZBtn from "../ZBtn/ZBtn.vue";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
import { createCanvas } from "@/common/create";
import { getId } from "@/common/utils";
import type { ZCanvasList, ZCanvas, ZDragNode, ZMap } from "@/common/type";
defineOptions({
	name: "ZDesign",
});
const canvas = defineModel<ZCanvasList>("canvas", {
	required: true,
});
const selectCanvas = defineModel<ZCanvas>("selectCanvas", {
	required: true,
});
const selectNode = defineModel<ZDragNode>("selectNode");
const treeMap = defineModel<ZMap>("treeMap");
const select = (canvasItem: ZCanvas) => {
	selectCanvas.value = canvasItem;
	selectNode.value = undefined;
};
const tabs = ref([
	{
		label: "页面",
		name: "page",
	},
	{
		label: "页面结构",
		name: "nodes",
	},
]);
const selectTab = ref("page");
const pages = computed(() =>
	selectCanvas.value.children?.filter((item) => item.type === "page")
);
const tabItemRefs = ref<HTMLElement[]>([]);
const tabSlider = ref({
	width: 0,
	height: 0,
	x: 0,
	y: 0,
});
const observe = ref<InstanceType<typeof ResizeObserver> | null>(null);
const createObserver = (target: HTMLElement) => {
	observe.value = new ResizeObserver((entries) => {
		console.log(entries);
		for (let entry of entries) {
			tabSlider.value.width = entry.target.offsetWidth;
			tabSlider.value.height = entry.target.offsetHeight;
			tabSlider.value.x = entry.target.offsetLeft;
			tabSlider.value.y = entry.target.offsetTop;
		}
	});
	observe.value.observe(target, {
		attributes: true,
	});
};
const clearObserver = () => {
	if (!observe.value) return;
	observe.value.disconnect();
	observe.value = null;
};
const addCanvas = () => {
	canvas.value.push(createCanvas("canvas-" + getId()));
};
const removeCanvas = (id: string) => {
	if (canvas.value.length === 1) return;
	let newCanvasList = canvas.value.filter((i) => i.id !== id);
	// console.log(newCanvasList);
	canvas.value = newCanvasList;
	// console.log(id === selectCanvas.value.id, canvas.value);
	nextTick(() => {
		if (id === selectCanvas.value.id) {
			selectCanvas.value = canvas.value[0];
		}
	});
};
onUnmounted(() => {
	clearObserver();
});
watch(
	() => selectTab.value,
	() => {
		clearObserver();
		if (selectTab.value === "page") {
			createObserver(tabItemRefs.value[0]);
			tabSlider.value.width = tabItemRefs.value[0].offsetWidth;
			tabSlider.value.height = tabItemRefs.value[0].offsetHeight;
			tabSlider.value.x = tabItemRefs.value[0].offsetLeft;
			tabSlider.value.y = tabItemRefs.value[0].offsetTop;
		} else {
			createObserver(tabItemRefs.value[1]);
			tabSlider.value.width = tabItemRefs.value[1].offsetWidth;
			tabSlider.value.height = tabItemRefs.value[1].offsetHeight;
			tabSlider.value.x = tabItemRefs.value[1].offsetLeft;
			tabSlider.value.y = tabItemRefs.value[1].offsetTop;
		}
	}
);
onMounted(() => {
	createObserver(tabItemRefs.value[0]);
	tabSlider.value.width = tabItemRefs.value[0].offsetWidth;
	tabSlider.value.height = tabItemRefs.value[0].offsetHeight;
	tabSlider.value.x = tabItemRefs.value[0].offsetLeft;
	tabSlider.value.y = tabItemRefs.value[0].offsetTop;
});
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
				<li
					class="z-canvas-list-item"
					v-for="(item, i) in canvas"
					:key="item.id"
					@click="select(item)"
					:class="{
						active: selectCanvas?.id === item.id,
					}"
				>
					<span>
						{{ item.label }}
					</span>
					<ZBtn
						v-if="canvas.length !== 1"
						@click.stop="removeCanvas(item.id)"
						color="text-danger"
						:padding="false"
						>删除</ZBtn
					>
				</li>
			</ul>
		</div>
		<div class="line"></div>
		<div class="z-design_bottom">
			<div class="z-design-tabs">
				<div
					:style="{
						width: `${tabSlider.width}px`,
						height: `${tabSlider.height}px`,
						left: `${tabSlider.x}px`,
						top: `${tabSlider.y}px`,
					}"
					class="z-design-tabs-slider"
				></div>
				<div
					class="z-design-tabs-item"
					v-for="item in tabs"
					:key="item.value"
					tabindex="-1"
					@click="selectTab = item.name"
					:class="{
						active: selectTab === item.name,
					}"
					ref="tabItemRefs"
				>
					{{ item.label }}
				</div>
			</div>
		</div>
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
				font-weight: 300;
				padding: 0;
				margin: 0;
			}
			border: 1px solid rgb(var(--z-quiet));
			border-top: none;
			// border-radius: 0 0 8px 16px;
			// box-shadow: 0px 3px 5px -4px rgba(64, 87, 109, 0.3);
			box-shadow: 0px 3px 6px rgba(64, 87, 109, 0.3);
		}
		.canvas-list {
			list-style: none;
			padding: 8px 4px;
			margin: 0;
			.z-canvas-list-item {
				padding: 4px 4px;
				border-radius: 4px;
				height: 25px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: var(--z-font-sm);
				margin-bottom: 4px;
				box-shadow: 0px 3px 6px rgba(64, 87, 109, 0.1);
				border: 1px solid rgb(var(--z-quiet));
				background: linear-gradient(
						to right,
						rgb(var(--z-primary)),
						rgb(var(--z-primary))
					)
					no-repeat right bottom;
				background-size: 0 1px;
				transition: background-size 1s;
				&.active {
					background-position: left bottom;
					background-size: 100% 1px;
				}
			}
		}
	}
	.z-design_bottom {
		width: 100%;
		height: 50%;
		max-height: 80%;
		padding-top: 8px;
		.z-design-tabs {
			display: flex;
			gap: 6px;
			padding: 4px 8px;
			background-color: rgba(var(--z-quiet), 0.3);
			position: relative;
			.z-design-tabs-item {
				padding: 4px 8px;
				font-size: var(--z-font-sm);
				flex: 1;
				text-align: center;
				border-radius: 4px;
				cursor: pointer;
				user-select: none;
				&:not(.active):hover {
					box-shadow: 0 0 6px rgba(64, 87, 109, 0.1);
					background-color: rgb(var(--z-page));
					transition: all 0.3s ease;
					color: rgb(var(--z-primary));
				}
				&:not(.active):active {
					box-shadow: 0 0 6px rgba(64, 87, 109, 0.1);
					background-color: rgba(var(--z-page), 0.6);
					transform: scale(0.98);
					user-select: none;
					transition: all 0.3s ease;
					color: rgb(var(--z-primary));
				}
				&.active {
					color: rgb(var(--z-text-light));
				}
				z-index: 1;
			}
			.z-design-tabs-slider {
				position: absolute;
				top: 0;
				left: 0;
				background-color: rgb(var(--z-primary));
				border-radius: 4px;
				transition: left 0.15s ease;
			}
		}
	}
	.line {
		height: 1px;
		background: rgb(var(--z-quiet));
		width: 100%;
	}
}
</style>
