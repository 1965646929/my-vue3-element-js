<template>
    <el-config-provider :locale="locale" :size="size">
        <!-- 开启水印 -->
        <el-watermark
            :font="{ color: fontColor }"
            :content="watermarkEnabled ? defaultSettings.watermarkContent : ''"
            :z-index="9999"
            class="wh-full"
        >
            <router-view />
        </el-watermark>
    </el-config-provider>
</template>

<script setup>
import { useAppStore, useSettingsStore } from "@/store";
import defaultSettings from "@/settings";
import { ThemeMode } from "@/enums/settings/theme.enum";

const appStore = useAppStore();
const settingsStore = useSettingsStore();

const locale = computed(() => appStore.locale);
const size = computed(() => appStore.size);
const watermarkEnabled = computed(() => settingsStore.watermarkEnabled);
// 明亮/暗黑主题水印字体颜色适配
const fontColor = computed(() => {
    return settingsStore.theme === ThemeMode.DARK
        ? "rgba(255, 255, 255, .15)"
        : "rgba(0, 0, 0, .15)";
});
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
