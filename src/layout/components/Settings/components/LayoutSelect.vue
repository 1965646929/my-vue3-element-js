<template>
    <div class="layout-select">
        <el-tooltip
            v-for="item in layoutOptions"
            :key="item.value"
            :content="item.label"
            placement="bottom"
        >
            <div
                role="button"
                tabindex="0"
                :class="['layout-item', item.className, { 'is-active': modelValue == item.value }]"
                @click="handleLayoutChange(item.value)"
                @keydown.enter.space="handleLayoutChange(item.value)"
            >
                <div class="layout-item-part"></div>
                <div class="layout-item-part"></div>
            </div>
        </el-tooltip>
    </div>
</template>
<script setup>
import { LayoutMode } from "@/enums/settings/layout.enum";
const layoutOptions = [
    {
        value: LayoutMode.LEFT,
        label: "左侧模式",
        className: "left",
    },
    {
        value: LayoutMode.TOP,
        label: "顶部模式",
        className: "top",
    },
    {
        value: LayoutMode.MIX,
        label: "混合模式",
        className: "mix",
    },
];
const modelValue = defineModel("modelValue", {
    required: true,
    default: () => LayoutMode.LEFT,
});

const handleLayoutChange = function (layout) {
    modelValue.value = layout;
};
</script>
<style lang="scss" scoped>
.layout-select {
    display: flex;
    gap: 10px;
    justify-content: space-evenly;
    padding: 10px 0;
    --layout-primary: #1b2a47;
    --layout-background: #f0f2f5;
    --layout-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    --layout-hover: #e3f1f9;
    .layout-item {
        position: relative;
        width: 18%;
        height: 50px;
        cursor: pointer;
        background: var(--layout-background);
        border-radius: 8px;
        box-shadow: var(--layout-shadow);
        transition: transform 0.2s ease, border-color 0.2s ease, box-show 0.2s ease;
        &:hover {
            background-color: var(--layout-hover);
            transform: scale(1.02);
        }
        &:focus-visible {
            outline: 2px solid var(--el-color-primary);
        }
        &-part {
            position: absolute;
            background: var(--layout-primary);
            border-radius: 4px;
            box-shadow: var(--layout-shadow);
            transition: all 0.3 ease;
        }
        &.left {
            .layout-item-part {
                &:first-child {
                    width: 30%;
                    height: 100%;
                    border-radius: 4px 0 0 4px;
                }
                &:last-child {
                    top: 0px;
                    right: 0px;
                    width: 70%;
                    height: 30%;
                    background: #fff;
                    border-radius: 0 4px 4px 0;
                }
            }
        }
        &.top {
            .layout-item-part:first-child {
                width: 100%;
                height: 30%;
                border-radius: 4px 4px 0 0;
            }
        }
        &.mix {
            .layout-item-part {
                &:first-child {
                    width: 100%;
                    height: 30%;
                    border-radius: 4px 4px 0 0;
                }
                &:last-child {
                    bottom: 0;
                    left: 0;
                    width: 30%;
                    height: 70%;
                    border-radius: 0 0 4px 4px;
                }
            }
        }
    }
}
.is-active {
    background-color: var(--layout-hover);
    border: 2px solid var(--el-color-primary);
    transform: scale(1.05);
}
</style>
