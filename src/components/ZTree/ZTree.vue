<script lang="ts">
import { defineComponent, computed, h, getCurrentInstance } from "vue";
import type { PropType } from "vue";
import type { ZTreeNode } from "./type";
import ZSvgIcon from "../ZSvgIcon/ZSvgIcon.vue";
export default defineComponent({
  name: "ZTree",
  props: {
    nodes: {
      type: Array as PropType<ZTreeNode[]>,
      required: true,
    },
    select: {
      type: Object as PropType<ZTreeNode>,
    },
  },
  emits: ["update:select"],
  setup(props, ctx) {
    const scopedId = (getCurrentInstance()!.type as { __scopeId: string }).__scopeId;
    const setSelect = (item: ZTreeNode) => {
      // console.log(item);
      ctx.emit("update:select", item);
    };
    const renderNode = (node: ZTreeNode) => {
      if (node.children && node.children.length) {
        return h(
          "div",
          {
            class: {
              "z-tree-group": true,
              active: node.id === props.select?.id,
            },
            [scopedId]: true,
          },
          {
            default: () => {
              return [
                h(
                  "div",
                  {
                    class: {
                      "z-tree-item": true,
                      active: node.id === props.select?.id,
                    },

                    [scopedId]: true,
                  },
                  {
                    default: () => {
                      return [
                        h(ZSvgIcon, {
                          name: node.isExpanded ? "xiangxia-xian" : "xiangyou-xian",
                          size: "sm",
                          onClick: () => {
                            node.isExpanded = !node.isExpanded;
                          },
                        }),
                        h(
                          "div",
                          {
                            onClick: () => {
                              setSelect(node);
                            },
                            class: "text",
                          },
                          node.label
                        ),
                        h(
                          "div",
                          {
                            class: "icons",
                            [scopedId]: true,
                          },
                          {
                            default: () => [],
                          }
                        ),
                      ];
                    },
                  }
                ),
                node.isExpanded
                  ? h(
                      "div",
                      {
                        class: {
                          "z-tree-group-content": true,
                        },
                        [scopedId]: true,
                      },
                      {
                        default: () => {
                          return node.children!.map((item) => renderNode(item));
                        },
                      }
                    )
                  : undefined,
              ];
            },
          }
        );
      } else {
        return h(
          "div",
          {
            class: {
              "z-tree-item": true,
              active: node.id === props.select?.id,
            },
            onClick: () => setSelect(node),
            [scopedId]: true,
          },
          {
            default: () => {
              return [
                // h(ZSvgIcon, {
                //   name: node.isExpanded ? "xiangxia-xian" : "xiangyou-xian",
                //   size: "sm",
                //   onClick: () => {
                //     node.isExpanded = !node.isExpanded;
                //   },
                // }),
                h(
                  "div",
                  {
                    onClick: () => {
                      setSelect(node);
                    },
                    class: "text",
                  },
                  node.label
                ),
                h(
                  "div",
                  {
                    class: "icons",
                    [scopedId]: true,
                  },
                  {
                    default: () => [],
                  }
                ),
              ];
            },
          }
        );
      }
    };
    const tree = computed(() =>
      h(
        "div",
        {
          class: {
            "z-tree": true,
          },
          [scopedId]: true,
        },
        {
          default: () => props.nodes.map((item) => renderNode(item)),
        }
      )
    );
    return {
      tree,
    };
  },
  render() {
    return this.tree;
  },
});
</script>
<style scoped lang="scss">
.z-tree {
  padding: 4px 8px;
  font-size: var(--z-font-sm);
  .z-tree-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    gap: 4px;
    user-select: none;
    &.active {
      background: rgba(var(--z-quiet), 0.6);
    }
    &:hover {
      background: rgba(var(--z-quiet), 0.3);
    }
    .icons {
      align-self: flex-end;
    }
    .text {
      flex: 1;
    }
  }
  .z-tree-group {
    &.active {
      & > .z-tree-group-content {
        background: rgba(var(--z-quiet), 0.2);
      }
    }
  }
  .z-tree-group-content {
    padding-left: 20px;
  }
}
</style>
