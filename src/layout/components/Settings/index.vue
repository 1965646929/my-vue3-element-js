<template>
    <el-drawer
        v-model="drawerVisible"
        size="300"
        :title="$t('settings.project')"
        :before-close="handleCloseDrawer"
    >
        <section class="config-section">
            <el-divider>{{ $t("settings.theme") }}</el-divider>
            <div class="flex-center">
                <el-switch
                    v-model="isDark"
                    active-icon="Moon"
                    inactive-icon="Sunny"
                    @change="handleThemeChange"
                ></el-switch>
            </div>
        </section>
        <!-- 界面设置 -->
        <section class="config-section">
            <el-divider>{{ $t("settings.interface") }}</el-divider>
            <div class="config-item flex-x-between">
                <span class="text-xs">{{ $t("settings.themeColor") }}</span>
                <el-color-picker
                    v-model="selectedThemeColor"
                    :predefine="colorPresets"
                    popper-class="theme-picker-dropdown"
                ></el-color-picker>
            </div>
            <div class="config-item flex-x-between">
                <span class="text-xs">{{ $t("settings.tagsView") }}</span>
                <el-switch v-model="settingsStore.tagsView"></el-switch>
            </div>
            <div class="config-item flex-x-between">
                <span class="text-xs">{{ $t("settings.sidebarLogo") }}</span>
                <el-switch v-model="settingsStore.sidebarLogo"></el-switch>
            </div>
            <div class="config-item flex-x-between">
                <span class="text-xs">{{ $t("settings.watermark") }}</span>
                <el-switch v-model="settingsStore.watermarkEnabled"></el-switch>
            </div>
            <div class="config-item flex-x-between" v-if="!isDark">
                <span class="text-xs">{{ $t("settings.sidebarColorScheme") }}</span>
                <el-radio-group v-model="sidebarColor" @change="changeSidebarColor">
                    <el-radio :value="SidebarColor.CLASSIC_BLUE">{{
                        $t("settings.classicBlue")
                    }}</el-radio>
                    <el-radio :value="SidebarColor.MINIMAL_WHITE">{{
                        $t("settings.minimalWhite")
                    }}</el-radio>
                </el-radio-group>
            </div>
        </section>
        <!-- 布局设置 -->
        <section class="config-section">
            <el-divider>{{ $t("settings.navigation") }}</el-divider>
            <LayoutSelect
                v-model="settingsStore.layout"
                @update:model-value="handleLayoutChange"
            ></LayoutSelect>
        </section>
    </el-drawer>
</template>
<script setup>
import { LayoutMode } from "@/enums/settings/layout.enum";
import { ThemeMode } from "@/enums/settings/theme.enum";
import { SidebarColor } from "@/enums/settings/theme.enum";
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";
import { computed } from "vue";
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const appStore = useAppStore();
// 颜色预设
const colorPresets = [
    "#4080FF",
    "#626AEF",
    "#ff4500",
    "#ff8c00",
    "#00ced1",
    "#1e90ff",
    "#c71585",
    "rgb(255, 120, 0)",
    "hsva(120, 40, 94)",
];
const route = useRoute();

const drawerVisible = computed({
    get: () => {
        console.log("get");
        return settingsStore.settingsVisible;
    },
    set: value => {
        console.log("set", value);
        settingsStore.settingsVisible = value;
    },
});
const selectedThemeColor = computed({
    get: () => settingsStore.themeColor,
    set: value => settingsStore.changeThemeColor(value),
});
const isDark = ref(settingsStore.theme == ThemeMode.DARK);
const sidebarColor = ref(settingsStore.sidebarColorScheme);

const handleCloseDrawer = () => {
    settingsStore.settingsVisible = false;
};
//是否启用暗黑模式
const handleThemeChange = isDark => {
    settingsStore.changeTheme(isDark ? ThemeMode.DARK : ThemeMode.LIGHT);
};
//更换侧边栏颜色
const changeSidebarColor = val => {
    settingsStore.changeSidebarColor(val);
};
//切换布局
const handleLayoutChange = layout => {
    settingsStore.changeLayout(layout);
    if (layout == LayoutMode.MIX && route.name) {
        const topLevelRoute = findTopLevelRoute(permissionStore.routes, route.name);
        if (appStore.activeTopMenuPath !== topLevelRoute.path) {
            appStore.activeTopMenu(topLevelRoute.path);
        }
    }
};

//查找路由
//Q:没看明白
function findTopLevelRoute(tree, findName) {
    let parentMap = {};
    function buildParentMap(node, parent) {
        parentMap[node.name] = parent;
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                buildParentMap(node.children[i], node);
            }
        }
    }
    for (let i = 0; i < tree.length; i++) {
        buildParentMap(tree[i], null);
    }
    let currentNode = parentMap[findName];
    while (currentNode) {
        if (!parentMap[currentNode.name]) {
            return currentNode;
        }
        currentNode = parentMap[currentNode.name];
    }
    return;
}
</script>
<style lang="scss" scoped>
.config-section {
    margin-bottom: 24px;
    .config-item {
        padding: 12px 0;
        border-bottom: 1px solid var(--el-border-color-light);
        &:last-child {
            border-bottom: none;
        }
    }
}
</style>
