<template>
    <div class="app-container">
        <div class="flex-x-between mb-10">
            <el-link
                href="https://gitee.com/youlaiorg/vue3-element-admin/blob/master/src/views/demo/curd/index.vue"
                type="primary"
                target="_blank"
            >
                示例源代码，请点击>>>>
            </el-link>
            <el-button type="primary" plain round size="small" @click="isA = !isA"
                >切换示例</el-button
            >
        </div>
    </div>

    <!-- 列表 -->
    <template v-if="isA">
        <!-- 搜索 -->
        <page-search
            ref="searchRef"
            :search-config="searchConfig"
            @query-click="handleQueryClick"
            @reset-click="handleResetClick"
        ></page-search>
    </template>
</template>
<script setup>
import searchConfig from "./config/search";
//切换示例
const isA = ref(true);
</script>
<style lang="scss" scoped></style>
