<template>
    <el-breadcrumb class="flex-y-center">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
            <span
                v-if="item.redirect == 'noredirect' || index == breadcrumbs.length - 1"
                class="color-gray-400"
            >
                {{ translateRouteTitle(item.meta.title) }}
            </span>
            <a v-else @click.prevent="handleLink(item)">
                {{ translateRouteTitle(item.meta.title) }}
            </a>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script setup>
import { compile } from "path-to-regexp";
import router from "@/router";
import { translateRouteTitle } from "@/utils/i18n";
import { onBeforeMount } from "vue";
const breadcrumbs = ref([]);
const currentRoute = useRoute();
const pathCompile = path => {
    const { params } = currentRoute;
    const toPath = compile(path);
    return toPath(params);
};
function getBreadcrumb() {
    let matched = currentRoute.matched.filter(item => item.meta && item.meta.title);
    const first = matched[0];
    if (!isDashboard(first)) {
        matched = [{ path: "/dashboard", meta: { title: "dashboard" } }].concat(matched);
    }
    breadcrumbs.value = matched.filter(item => {
        //Q:breadcrumb没找到这个属性
        return item.meta && item.meta.title && item.meta.breadcrumb !== false;
    });
}
function isDashboard(route) {
    const name = route && route.name;
    if (!name) return false;
    return name.toString().trim().toLocaleLowerCase() == "Dashboard".toLocaleLowerCase();
}
function handleLink(item) {
    const { redirect, path } = item;
    if (redirect) {
        router.push(redirect).catch(err => {
            console.warn(err);
        });
        return;
    }
    router.push(pathCompile(path)).catch(err => {
        console.warn(err);
    });
}
watch(
    () => currentRoute.path,
    path => {
        if (path.startsWith("/redirect/")) {
            return;
        }
        getBreadcrumb();
    }
);
onBeforeMount(() => {
    getBreadcrumb();
});
</script>
<style lang="scss" scoped>
// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
    font-weight: 400 !important;
}
</style>
