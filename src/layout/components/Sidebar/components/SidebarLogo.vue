<template>
    <div class="logo">
        <transition enter-active-class="animate__animated animate__fadeInLeft">
            <router-link :key="+collapse" class="wh-full flex-center" to="/">
                <img :src="logo" class="h20px w20px" />
                <span v-if="!collapse" class="title">
                    {{ defaultSettings.title }}
                </span>
            </router-link>
        </transition>
    </div>
</template>
<script setup>
import defaultSettings from "@/settings";
import logo from "@/assets/logo.png";
defineProps({
    collapse: {
        type: Boolean,
        required: true,
    },
});
</script>
<style lang="scss" scoped>
.logo {
    width: 100%;
    height: $navbar-height;
    .title {
        flex-shrink: 0; /* 防止容器在空间不足时缩小 */
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
        color: $sidebar-logo-text-color;
    }
}
.layout-top,
.layout-mix {
    .logo {
        width: $sidebar-width;
    }
    &.hideSidebar {
        width: $sidebar-width-collapsed;
    }
}
</style>
