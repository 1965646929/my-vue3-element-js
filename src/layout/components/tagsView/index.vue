<template>
    <div class="tag-container">
        <el-scrollbar class="scroll-container" :vertical="false" @whell="handleScroll">
            <router-link
                v-for="tag in visitedViews"
                ref="tagRef"
                :key="tag.fullPath"
                :class="'tag-item' + (tagsViewStore.isActive(tag) ? 'active' : '')"
                :to="{ path: tag.path, query: tag.query }"
                @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
                @contextmenu.prevent="openContentMenu(tag, $event)"
            >
                <!-- 标签文本 -->
                <span class="tag-text">{{ translateRouteTitle(tag.title) }}</span>
                <!-- 关闭按钮，固定标签不显示 -->
                <span
                    v-if="!isAffix(tag)"
                    class="tag-close-icon"
                    @click.prevent.stop="closeSelectedTag(tag)"
                    >x</span
                >
            </router-link>
        </el-scrollbar>
        <!-- 标签右键菜单 -->
        <ul
            v-show="contentMenuVisible"
            class="contextmenu"
            :style="{ left: left + 'px', top: top + 'px' }"
        >
            <li @click="refreshSelectedTag(selectedTag)">
                <div class="i-svg:refresh">刷新</div>
            </li>
            <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
                <div class="i-svg:close">关闭</div>
            </li>
            <li @click="closeOtherTags">
                <div class="i-svg:close_other">关闭其它</div>
            </li>
            <li v-if="!isFirstView()" @click="closeLeftTags">
                <div class="i-svg:close_left">关闭左侧</div>
            </li>
            <li v-if="!isLastView()" @click="closeRightTags">
                <div class="i-svg:close_right">关闭右侧</div>
            </li>
            <li @click="closeAllTags(selectedTag)">
                <div class="i-svg:close-all">关闭所有</div>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { resolve } from "path-browserify";
import { translateRouteTitle } from "@/utils/i18n";
import { usePermissionStore, useTagsViewStore } from "@/store";
import { nextTick } from "vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
// 权限、标签页状态管理
const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();

const { visitedViews } = storeToRefs(tagsViewStore);

//当前选中的标签
const selectedTag = ref({
    path: "",
    fullPath: "",
    name: "",
    title: "",
    affix: false,
    keepAlive: false,
});

const affixTags = ref([]);
const left = ref(0);
const top = ref(0);

//右键菜单显示状态
const contentMenuVisible = ref(false);
//监听右键菜单显示状态，添加或移除点击事件
watch(contentMenuVisible, value => {
    if (value) {
        document.body.addEventListener("click", closeContentMenu);
    } else {
        document.body.removeEventListener("click", closeContentMenu);
    }
});
//关闭右键
function closeContentMenu() {
    contentMenuVisible.value = false;
}
/*
处理鼠标滚动事件，实现水平滚动
 */
function handleScroll(e) {
    const eventDelta = e.wheelDelta || -e.deltaY * 40;
    const $scrollWrapper = proxy?.$el.querySelector(".scroll-container");
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
}

//判断是否为固定标签
function isAffix(tag) {
    return tag?.affix;
}

//关闭选中的标签
function closeSelectedTag(view) {
    tagsViewStore.delView(view).then(res => {
        if (tagsViewStore.isActive(view)) {
            tagsViewStore.toLastView(res.visitedViews, view);
        }
    });
}

//刷新选中的标签
function refreshSelectedTag(view) {
    tagsViewStore.delCachedView(view);
    const { fullPath } = view;
    nextTick(() => {
        router.replace("/redirect" + fullPath);
    });
}

function openContentMenu(tag, e) {
    const menuMinWidth = 105;
    const offsetLeft = proxy?.$el.getBoundingClientRect().left; // 容器左边距
    const offsetWidth = proxy?.$el.offsetWidth; // 容器宽度
    const maxLeft = offsetWidth - menuMinWidth; // 左边界
    const leftPosition = e.clientX - offsetLeft + 15; // 15: 右边距

    // 确保菜单不超出容器右边界
    if (leftPosition > maxLeft) {
        left.value = maxLeft;
    } else {
        left.value = leftPosition;
    }
    top.value = e.clientY;
    contentMenuVisible.value = true;
    selectedTag.value = tag;
}
//关闭选中标签以外的所有标签
function closeOtherTags() {
    router.push(selectedTag.value);
    tagsViewStore.delOtherViews(selectedTag.value).then(() => {
        moveToCurrentTag();
    });
}
function moveToCurrentTag() {
    nextTick(() => {
        for (const tag of visitedViews.value) {
            if (tag.path == route.path) {
                //当查询参数不同时更新标签
                if (tag.fullPath != route.fullPath) {
                    tagsViewStore.updateVisitedView({
                        name: route.name,
                        title: route.title,
                        path: route.path,
                        fullPath: route.fullPath,
                        affix: route.meta?.affix,
                        keepAlive: route.meat?.keepAlive,
                        query: route.query,
                    });
                }
            }
        }
    });
}
function isFirstView() {
    return (
        selectedTag.value.path == "/dashboard" ||
        selectedTag.value.fullPath == tagsViewStore.visitedViews[1]?.fullPath
    );
}
function closeLeftTags() {
    tagsViewStore.delLeftViews(selectedTag.value).then(res => {
        if (!res.visitedViews.find(item => item.path == route.path)) {
            tagsViewStore.toLastView(res.visitedViews);
        }
    });
}
function closeRightTags() {
    tagsViewStore.delRightViews(selectedTag.value).then(res => {
        if (!res.visitedViews.find(item => item.path == route.path)) {
            tagsViewStore.toLastView(res.visitedViews);
        }
    });
}
function closeAllTags(view) {
    tagsViewStore.delAllViews().then(res => {
        tagsViewStore.toLastView(res.visitedViews, view);
    });
}
function filterAffixTags(routes, basePath = "/") {
    let tags = [];
    routes.forEach(route => {
        const tagPath = resolve(basePath, route.path);
        if (route.meta?.affix) {
            tags.push({
                path: tagPath,
                fullPath: tagPath,
                name: String(route.name),
                title: route.meta?.title || "no-name",
                affix: route.meat?.affix,
                keepAlive: route.meta?.keepAlive,
            });
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, basePath + route.path);
            if (tempTags.length) {
                tags = [...tags, ...tempTags];
            }
        }
    });
    return tags;
}

function initTags() {
    const tags = filterAffixTags(permissionStore.routes);
    affixTags.value = tags;
}
//判断选中标签是否为最后一个可见标签
function isLastView() {
    return (
        selectedTag.value.fullPath ==
        tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1]?.fullPath
    );
}
//组件挂载时初始化标签
onMounted(() => {
    initTags();
});
</script>
<style lang="scss" scoped></style>
