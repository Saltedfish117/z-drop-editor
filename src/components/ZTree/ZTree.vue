<script lang="ts">
import { defineComponent, computed, h, getCurrentInstance } from "vue";
import type { PropType } from "vue";
// import {getId} from ''
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
}
export default defineComponent({
  name: "ZTree",
  props: {
    nodes: {
      type: Array as PropType<TreeNode[]>,
      required: true,
    },
    select: {
      type: Object as PropType<TreeNode>,
    },
  },
  emits: ["update:select"],
  setup(props, ctx) {
    const scopedId = getCurrentInstance()!.type.__scopeId;
    const setSelect = (item: TreeNode) => {
      console.log(item);
      ctx.emit("update:select", item);
    };
    const renderNode = (node: TreeNode) => {
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
                    onClick: () => {
                      console.log("click");
                      setSelect(node);
                    },
                    [scopedId]: true,
                  },
                  {
                    default: () => {
                      return node.label;
                    },
                  }
                ),
                h(
                  "div",
                  {
                    class: {
                      "z-tree-group-content": true,
                    },
                    [scopedId]: true,
                  },
                  {
                    default: () => {
                      return node.children.map((item) => renderNode(item));
                    },
                  }
                ),
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
              return node.label;
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
  .z-tree-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    &.active {
      background: rgba(var(--z-quiet), 0.6);
    }
    &:hover {
      background: rgba(var(--z-quiet), 0.3);
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
    & > .z-tree-item {
      padding-left: 20px;
    }
  }
}
</style>
