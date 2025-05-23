<template>
    <div @click="toggle">
        <div :class="'i-svg:' + (isFullscreen ? 'fullscreen-exit' : 'fullscreen')"></div>
    </div>
</template>
<script setup>
const { isFullscreen, toggle } = useFullscreen();
</script>
<style lang="scss" scoped></style>
