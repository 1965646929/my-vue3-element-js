<template>
    <div></div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const router = useRouter();
const { params, query } = route;
const { path } = params;
router.replace({ path: path + "/", query });
</script>
