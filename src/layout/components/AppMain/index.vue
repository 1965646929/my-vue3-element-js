<template>
    <section class="app-main" :style="{ height: appMainHeight }">
        <router-view>
            <template #default="{ Component, route }">
                <transition enter-active-class="animate__animated animate__fadeIn" mode="out-in">
                    <keep-alive :include="cachedViews">
                        <component :is="Component" :key="route.path" />
                    </keep-alive>
                </transition>
            </template>
        </router-view>
    </section>
</template>

<script setup>
import { useSettingsStore, useTagsViewStore } from "@/store";
import variables from "@/styles/variables.module.scss";

// 缓存页面集合
const cachedViews = computed(() => useTagsViewStore().cachedViews);
const appMainHeight = computed(() => {
    if (useSettingsStore().tagsView) {
        return `calc(100vh - ${variables["navbar-height"]} - ${variables["tags-view-height"]})`;
    } else {
        return `calc(100vh - ${variables["navbar-height"]})`;
    }
});
</script>

<style lang="scss" scoped>
.app-main {
    position: relative;
    overflow-y: auto;
    background-color: var(--el-bg-color-page);
}
</style>
