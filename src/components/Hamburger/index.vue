<template>
    <div class="hamburger-wrapper" @click="toggleClick">
        <div
            :class="['i-svg:collapse', { hamburger: true, 'is-active': isActive }, hamburgerClass]"
        ></div>
    </div>
</template>
<script setup>
defineProps({
    isActive: { type: Boolean, required: true },
});
import { useSettingsStore } from "@/store";
import { ThemeMode, SidebarColor } from "@/enums/settings/theme.enum";
import { LayoutMode } from "@/enums/settings/layout.enum";
const settingsStore = useSettingsStore();
const emit = defineEmits(["toggleClick"]);

//计算属性
const layout = computed(() => settingsStore.layout);
const hamburgerClass = computed(() => {
    // 如果暗黑主题
    if (settingsStore.theme == ThemeMode.DARK) {
        return "hamburger--white";
    }
    // 如果是混合布局 && 侧边栏配色方案是经典蓝
    if (
        layout.value == LayoutMode.MIX &&
        settingsStore.sidebarColorScheme == SidebarColor.CLASSIC_BLUE
    ) {
        return "hamburger--white";
    }
});
function toggleClick() {
    emit("toggleClick");
}
</script>
<style lang="scss" scoped>
.hamburger-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    cursor: pointer;
    .hamburger {
        vertical-align: middle;
        transform: scaleX(-1);
        transition: transform 0.3s ease;

        &--white {
            color: #fff;
        }

        &.is-active {
            transform: scaleX(1);
        }
    }
}
</style>
